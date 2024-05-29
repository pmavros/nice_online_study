preds <- data.frame()
params <- data.frame()
mods <- list()
outcome_var <- "Crowdedness"
vars <- c("Beauty", "Scenic","Width", "Structure") # replaced familiarity with Beauty
i=1
# for (i in 1:length(vars)) {
  var <- vars[i]
  print(var)

  f1 <- paste0(outcome_var, " ~ log1p(video_mean_pedcounts) * ", var, " + log1p(video_mean_pedcounts) * Typology  + Familiarity + (", var, "|Participant)")
  f2 <- paste0(outcome_var, " ~ log1p(video_mean_pedcounts) * ", var, " + log1p(video_mean_pedcounts) * Typology + Familiarity  + (", var, "|Participant) + (1|video_City)")
  f3 <- paste0(outcome_var, " ~ log1p(video_mean_pedcounts) * ", var, " + log1p(video_mean_pedcounts) * Typology + Familiarity  + (", var, "|Participant) + (1|Video)")


  model1 <- glmmTMB::glmmTMB(as.formula(f1), data = df)
  model2 <- glmmTMB::glmmTMB(as.formula(f2), data = df)
  model3 <- glmmTMB::glmmTMB(as.formula(f3), data = df)
  model4 <- glmmTMB::glmmTMB(as.formula(f2), data = df %>%
                               group_by(video_name_df_keep) %>%
                               mutate(Beauty = mean(Beauty)) %>%
                               ungroup())


library(ordinal)
summary(model4 <- ordinal::clmm(as.factor(Crowdedness) ~ log1p(video_mean_pedcounts) + Beauty * Typology  + Familiarity + (1|Participant), data = df))


summary(model1)
summary(model2)
summary(model3)
summary(model4)


performance::check_posterior_predictions(model3, iterations = 50, check_range = F)
