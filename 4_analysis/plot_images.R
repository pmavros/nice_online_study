library(tidyverse)

df <-
  read.csv(
    "/Users/panosmavros/Library/CloudStorage/Dropbox/FCL_Panos/01_Projects/NICE/NICE_Group-Folder/9_analysis/Online Study/data/data_pruned_for_analysis_2023-05-15.csv"
  ) %>%
  mutate(
    Typology = fct_relevel(video_primary_category, "urban", "green"),
    Valence = datawizard::rescale(Valence, to = c(1, 7), range = c(1, 9)),
    Arousal = datawizard::rescale(Arousal, to = c(1, 7), range = c(1, 9))
  ) %>%
  rename("Participant" = Anonymised_ID )


cc <- read_csv("~/Downloads/Videos_list_Labstudy - Online.csv")
names(cc)
cc
cc_clean <- cc %>%
  rename(cc = "CC License 379") %>%
  select(name_df_keep, cc)


df_selected <- df %>%
  left_join(cc_clean, by = c("video_name_df_keep" = "name_df_keep")) %>%
  filter(str_detect(cc, "Creative")) %>%
  mutate(videosource = gsub('[0-9]+', '', video_name_df))

  # check there are only 30 individual video sources (initial video clips)
  unique(df_selected$videosource)

df_selected_2 <- df_selected %>%
  group_by(Typology, video_name_df, video_name_df_keep, videosource) %>%
  summarise(mean_beauty = mean(Beauty, na.rm =T),
            mean_crowding = mean(Crowdedness, na.rm =T)) %>%
  ungroup()

df <- df_selected_2 %>%
  group_by(Typology) %>%
  mutate( hi_beauty = mean_beauty > mean(mean_beauty),
          hi_crowding = mean_crowding > mean(mean_crowding)) %>%
  group_by(Typology, hi_beauty, hi_crowding) %>%
  slice_sample(n = 2)

df

# group_by(videosource) %>%
#   slice(sample(4, )) %>%
#   ungroup() %>%
#   group_by(Typology) %>%
#   arrange(Typology, mean_beauty) %>%
#   slice(1:2, (n()-1):n()) %>%
#   arrange(Typology, mean_beauty)
#
# df_selected_crowding <- df_selected %>%
#   group_by(Typology, video_name_df, video_name_df_keep, videosource) %>%
#   summarise(mean_beauty = mean(Beauty, na.rm =T),
#             mean_crowding = mean(Crowdedness, na.rm =T)) %>%
#   arrange(Typology, mean_crowding) %>%
#   group_by(videosource) %>%
#   slice(n()) %>%
#   ungroup() %>%
#   group_by(Typology) %>%
#   arrange(Typology, mean_crowding) %>%
#   slice(1:2, (n()-1):n()) %>%
#   arrange(Typology, mean_crowding)


# df_selected_joint <- df_selected_beauty %>% bind_rows(df_selected_crowding)

frames <- data.frame(file = list.files("~/Dropbox/FCL_Panos/01_Projects/NICE/NICE_Group-Folder/3_materials/stimuli/frame/"),
                     fullpath  = list.files("~/Dropbox/FCL_Panos/01_Projects/NICE/NICE_Group-Folder/3_materials/stimuli/frame/", full.names = T))

frames <- frames %>%
  mutate(video_name_df_keep = str_remove(file, pattern = ".png"))

df_selected_joint <- df %>%
  left_join(frames)
df_selected_joint

# install.packages("ggimage")
# library(ggimage)

file.copy(df_selected_joint$fullpath, "/Users/panosmavros/Library/CloudStorage/Dropbox/FCL_Panos/01_Projects/NICE/NICE_Group-Folder/3_materials/stimuli/3_figure_2 option")

d <- df_selected_joint %>%
  select(Typology, mean_beauty,mean_crowding, fullpath) %>%
  group_by(Typology) %>%
  mutate(x = rank(mean_beauty),
         text = round(mean_beauty, 2),
         row =  5* ((x %% 2)-1),
         x = 2*ceiling(x/2))


d

# # geom_image
# library(ggimage)
# p <- ggplot(d, aes(x, row)) +
#   geom_image(aes(image=fullpath), size = .4) +
#   geom_label(aes(label = text), , position = position_nudge(y =-1.2, x= -.8)) +
#   scale_x_continuous(limits = c(0,10)) +
#   scale_y_continuous(limits = c(-7, 2.5)) +
#   theme_void() +
#   facet_wrap(Typology ~.,nrow = 2) +
#   theme( strip.text.x = element_blank() )
#
# plots <- list()

# # for (i in 1:nrow(d)){
# #   message(i)
# #     rm(p.tmp)
# #     p.tmp <- ggplot(d[i,], aes(0, 0)) +
# #       geom_image(aes(image=fullpath,  by = "height"), size = 1.2) +
# #       labs(title = glue::glue("B") ) +
# #       scale_y_continuous(limits = c(-1, 1))+
# #       scale_x_continuous(limits = c(-1, 1))+
# #       theme_void() +  theme(plot.margin=grid::unit(c(0,0,0,0), "mm"))
# #
# #     p.tmp
# #
# #     plots[[i]] <- p.tmp
# #
# # }
# plots
# length(plots)
# library(gridExtra)


# library(EBImage)
# library(magrittr)

library(magick)
library(tidyverse)
library(glue)

plots <- list()
d <- d %>% group_by(Typology) %>% arrange(Typology, mean_beauty)
d
for (i in 1:nrow(d)){
  message(i)
 try( rm(p.tmp), silent = T)

  p.tmp <- image_read(d$fullpath[i]) %>%
    image_annotate(glue(" B: {sprintf(d$mean_beauty[i], fmt = '%.2f')} "), location = geometry_point(0, 0), size = 100, color = "black", boxcolor = "white",weight = "500", font = "Arial") %>%
    image_annotate(glue(" C: {sprintf(d$mean_crowding[i], fmt = '%.2f')} "), location = geometry_point(0, 120), size = 100, color = "black", boxcolor = "white",weight = "500", font = "Arial")
  p.tmp

  plots[[i]] <- p.tmp

}

Reduce(`c`, plots) %>%
image_montage(., tile = '4',geometry = 'x1000+2+2') %>%
  image_convert(format = "jpg") %>%
image_write(., path = "~/Documents/GitHub/nice_online_study/4_analysis/figures/selected_stimuli.jpg", format = "jpg", density = "300")


