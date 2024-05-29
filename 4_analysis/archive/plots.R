
# tmp <- df %>%
#   left_join(video, by = c("Video" = "link") )

library(ggdist)
library(ggridges)

tmp %>%
  filter(!is.na(Crowdedness), !is.na(primary_category.x)) %>%
  ggplot(aes(mean, as.factor(Crowdedness), group=Participant, )) + #colour = primary_category.x
  # geom_jitter( size = 0.1, shape = 16) +
  theme_classic() +
  geom_smooth(method="lm", se = F, alpha = 0.1) +

  facet_grid(.~primary_category.x) +

  labs(title = "Comparison between perceived crowdedness and pedestrian counts",
       x = "Average person-count per frame",
       y = "Perceived crowdedness (1-7)")

tmp %>%
  filter(!is.na(Crowdedness), !is.na(primary_category.x)) %>%
  group_by(Video,primary_category.x) %>%
  summarise(mean_perceived_crowd = mean(Crowdedness),
            mean_ped_counts = mean(mean)) %>%
  ggplot(aes(mean_ped_counts, mean_perceived_crowd, colour = primary_category.x)) +
  geom_jitter(alpha = 0.75, shape = 16) +
  theme_classic() +
  facet_grid(.~primary_category.x) +
  labs(title = "Average ratings per video",
       x = "Average person-count per frame",
       y = "Perceived crowdedness (1-7)")

correlation::cor_test(x = "Crowdedness", y = "mean", data = tmp)


summary(fit <- lmer(Crowdedness ~ 0 + mean * primary_category.x +
                      mean*Background_Environment +  (1|Participant), tmp %>%
                      mutate(Background_Environment = Background_Rural == "urban" )))




hist(df_pruned$Video_Time)

df_pruned <- df_pruned %>%
  left_join(nice_online_study_filtered %>% select(link, duration), by = c("Video" = "link"))
filter(Video_Time > 21 & Video_Time < 60) %>%
  group_by(Video) %>%
  tally() %>%
  arrange(n) %>%
  pull(n)

df_pruned %>%
  filter(duration >= 30) %>%
  filter(Video_Time > 21 & Video_Time < 60) %>%
  group_by(Video) %>%
  tally() %>%
  arrange(n)


tmp2 <- tmp %>%
  filter(!is.na(Crowdedness), !is.na(primary_category.x)) %>%
  filter(Video_Time < 50) %>%
  group_by(Video) %>%
  mutate(average_perceived_crowdedness = mean(Crowdedness),
           z_perceived_crowdedness  = scale(Crowdedness)[,1],
         average_beauty = mean(Beauty),
         Background_Environment = str_replace(Background_Environment, pattern = " ", replacement = "") == "Urban") %>%
  ungroup()

tmp2 %>%
  ggplot(aes(average_perceived_crowdedness, primary_category.x, colour = Background_Environment == "Urban")) +
  geom_boxplot()

tmp2 %>%
  ggplot(aes(average_perceived_crowdedness, average_beauty , colour = primary_category.x)) +
  geom_point() +
  geom_smooth(method = "lm")

tmp2 %>%
  ggplot(aes(average_beauty, mean,  colour = primary_category.x)) +
  geom_point() +
  geom_smooth()


tmp2 %>%
  group_by(Participant) %>%
  slice(which.max(mean)) %>%
  ggplot(aes(Beauty, z_perceived_crowdedness,colour = primary_category.x == "urban" )) +
  geom_point() +
  geom_smooth(method = "lm")
  facet_grid(.~ primary_category.x)

most_crowded_stim <-   tmp2 %>%
    group_by(Participant) %>%
    slice(which.max(mean))

summary(fit <- lmer(Attractiveness ~ Beauty * z_perceived_crowdedness   + primary_category.x + Background_Environment + (1|Participant), tmp2))

summary(fit <- lmer(Attractiveness ~ Beauty * mean +  primary_category.x * Background_Environment + SSA_Mean + (1|Participant) + (1|Video),
                    tmp  %>%  mutate( Background_Environment = Background_Environment == "Urban")                    ))


              # Beauty + Structure + Interest + Familiarity + Scenery + Crowdedness + Width

# Attractiveness ####
summary(fit <- lmer(Attractiveness ~ mean + Beauty + Structure + Interest + Familiarity + Scenery + Crowdedness + Width + primary_category.x * Background_Environment + SSA_Mean + NSS + SIAS_Total_Mean + (1|Participant) + (1|Video),
                    tmp2                    )) # %>%  mutate( Background_Environment = Background_Environment == "Green"


# Presence ####
summary(fit <- lmer(Presence ~ mean + Beauty + Structure + Interest + Familiarity + Scenery + Crowdedness + Width + primary_category.x * Background_Environment + SSA_Mean + NSS + SIAS_Total_Mean + (1|Participant) + (1|Video),
                    tmp2                    )) # %>%  mutate( Background_Environment = Background_Environment == "Green"


# Excitement ####
summary(fit <- lmer(Excitement ~ mean + Beauty + Structure + Interest + Familiarity + Scenery + Crowdedness + Width + primary_category.x * Background_Environment + SSA_Mean + NSS + SIAS_Total_Mean + (1|Participant) + (1|Video),
                    tmp2                    )) # %>%  mutate( Background_Environment = Background_Environment == "Green"

# Positivity ####
summary(fit <- lmer(Positivity ~ mean + Beauty + Structure + Interest + Familiarity + Scenery  + Width + primary_category.x * Background_Environment + Concern_Covid_Mean + SSA_Mean + NSS + SPS_Total_Mean + SIAS_Total_Mean + (1|Participant) + (1|Video),
                    tmp2                    )) # %>%  mutate( Background_Environment = Background_Environment == "Green"




summary(lmer(z_perceived_crowdedness ~ Background_Environment +
               Beauty +
               Width +
               SSA_Mean +
               Concern_Covid_Mean +
               Architecture +
               ipip_Extroversion+
               ipip_Agreeableness+
               ipip_Conscientiousness+
               ipip_Neuroticism+
               ipip_Openness+
               ipip_Honesty+
               Crowd_Preference_Mean+
               SIAS_Total_Mean+
               SPS_Total_Mean+
               NSS+
               Video_Time+
               (1|Participant) + (1|Video), tmp2 %>% filter(primary_category.x == "urban")))



aggregate_scores <- tmp %>%
group_by(name_df.x, Video, primary_category.x) %>%
  summarise(mBeauty = mean(Beauty, na.rm = T),
            mWillingnessToVisit = mean(Attractiveness, na.rm = T),
            mValence = mean(Positivity, na.rm = T),
            mExcitement = mean(Excitement, na.rm = T),
            mScenic = mean(Scenery, na.rm = T),
            mRestorativeness = mean(Restoration, na.rm = T),
            mStructure = mean(Structure, na.rm = T),
            mInterest = mean(Interest, na.rm = T),
            mWidth = mean(Width, na.rm = T),
            mPedCounts = mean(mean, na.rm = T),
            mCrowdedness = mean(Crowdedness, na.rm = T)
  ) %>%
  ungroup()





aggregate_scores %>%
  pivot_longer(cols = 3:12 ) %>%
  # filter(name  %in% c("mBeauty")) %>%
  ggplot(aes(value,name)) +
  geom_jitter() +
  facet_wrap(.~name,scales = "free")

data <- aggregate_scores |>
  filter()
  select(-Video, -name_df.x)

d <- dist(data, diag = TRUE, upper=TRUE)

plot(hclust(d))

clusters <- cutree(hclust(d), k = 80)

aggregate_scores %>%
  ggplot(aes(mBeauty, mPedCounts, colour = primary_category.x)) +
  geom_point()

summary(lm(mCrowdedness ~ mPedCounts * mWidth, aggregate_scores))

# 4 hi Crowd - hi beauty
# 4 low Crowd - hi beauty
# 4 hi Crowd - low beauty
# 4 hi Crowd - low beauty

summary(fit_beauty_u <- lm(mBeauty ~ mStructure + mCrowdedness + mScenic + mInterest + mWidth, aggregate_scores %>%
             filter(primary_category.x == "urban")))

summary(fit_beauty_g <- lm(mBeauty ~ mStructure + mPedCounts + mScenic + mInterest + mWidth, aggregate_scores %>%
             filter(primary_category.x == "green")))


library(lmerTest)
summary(lmer(Attractiveness ~ primary_category.x*Crowdedness + Crowdedness*Beauty + mean + primary_category.x * Background_Environment+ (1|name_df.x) + (1|Participant), data = tmp))



