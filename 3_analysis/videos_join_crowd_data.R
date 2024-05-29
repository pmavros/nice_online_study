# Read raw pedestrian count data per frame
# Aggregate for each video
# join with other data we have for each video

data_pose = read_csv("data/ped_counts_pose4.csv")
data_pose <- data_pose %>%
  # slice(1) %>%
  mutate(video = str_remove(filename, pattern = "/Users/panosmavros/Dropbox/FCL_Panos/01_Projects/NICE/NICE_Group-Folder/3_materials/stimuli/nice_pose_data//"))

data_pose <- data_pose %>%
  separate(video, into = c("video", NA), sep = "/")

data_pose %>%
  group_by(video) %>%
  summarise(n_frames = n())


# videos with typology information
rm(video, video_duration)

video <- read_csv("../../3_materials/stimuli_scripts/Archived/final_set_with_testing_groups_typology.csv") %>%
  mutate(name_df_keep = name_df)
video

video_duration <- read_csv("../../3_materials/stimuli_scripts/Archived/final_set_with_duration.csv")
video_duration

video <- video %>%
  left_join(video_duration %>%
              select(link, duration),
            by = "link")

# clean-up the names to enable a join with the count data
# remove all special characters from sring, including white spaces
video <- video %>%
  select(videoname, name_df, name_df_keep, link, quality, rendition, fps, duration,   Country, Cluster, City, testing_group, primary_category, secondary_category) %>%
  mutate(name_df = str_remove_all(name_df_keep, pattern = "[^[:alnum:]]"),
         name_df = str_remove_all(name_df, pattern = "mp4"),
         name_df = str_replace_all(name_df, "ö", "o"),
         name_df = str_replace_all(name_df, "ç", "c")
         ) %>%
  mutate(name_df = if_else(str_sub(name_df, -3,-1) == "MOV", str_sub(name_df, 0,-4), name_df)) %>%
  arrange(name_df)

video$name_df[472:480]

# COMPUTE AVERAGE COUNT

data_pose <- data_pose %>%
  mutate(frame = str_sub(filename, -27, -1),
         frame = str_remove(frame, "_keypoints.json"),
         frame = as.numeric(frame))

data_pose <- data_pose %>%
  mutate(name_df = str_remove_all(video, pattern = "[^[:alnum:]]"),
         name_df = str_remove_all(name_df, pattern = "mp4")
  ) %>%
  left_join(video %>% select(name_df, fps, duration))

average_count <- data_pose %>%
  group_by(video, duration, fps) %>%
  mutate(max_playback = fps * 30) %>%
  filter(frame < max_playback) %>%
  summarise(n_frames = n(),
            mean_pedcounts = mean(ped_counts, na.rm = T),
            max_pedcounts = max(ped_counts, na.rm = T),
            sum_pedcounts = sum(ped_counts, na.rm = T)) %>%
  ungroup() %>%
  mutate(name_df = str_remove_all(video, pattern = "[^[:alnum:]]"),
         name_df = str_remove_all(name_df, pattern = "mp4")
  ) %>%
  arrange(video)

average_count

nrow(average_count)
hist(average_count$mean)
hist(average_count$sum)

average_count %>%
  arrange(desc(max_pedcounts))

write_csv(average_count, "data/average_count.csv")

# clean-up the names to enable a join with the count data
# remove all special characters from sring, including white spaces

video <- video %>%
  left_join(average_count %>% ungroup() %>% select(-c(video, duration,fps) ), by = "name_df") %>%
  arrange(name_df)

# sanity check, see which files have not joined
sum(is.na(video$mean_pedcounts)) # should be zero

write_csv(video, "../../3_materials/stimuli_scripts/final_set_with_testing_groups_typology_220914.csv")
