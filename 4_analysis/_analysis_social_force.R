library(tidyverse)

f <- list.files("../../NICE_Group-Folder/5_data/1_Online_study/Experiment Data/", recursive = F, full.names = T, pattern = ".csv")
f

data <- f %>% map_dfr(.id = "source",
              .f = read_csv)

final_ids <- unique(df$Participant)
final_ids

names(data)

# SF TASK
data %>%
  filter(subject_id %in% final_ids) %>%
  select(source, subject_id,  trial_index, sf_duration, collision_count,crowd_count, up_timestamps, down_timestamps) %>%
  filter(!is.na(crowd_count) & !is.na(sf_duration)) %>%
  group_by(subject_id) %>%
  tally() %>%
  filter(n < 8)
# check should evaluate nul

data %>%
  filter(subject_id %in% final_ids, str_starts(task, "sf_")) %>%
  select(source, subject_id, task, response, trial_index, sf_duration, collision_count,crowd_count, up_timestamps, down_timestamps) %>%
  print(n = 400) %>%
  group_by(subject_id) %>%
  mutate(across(c(sf_duration, collision_count, crowd_count, up_timestamps, down_timestamps), .fns =  function(x) if_else(is.na(x),lag(x, 1), x))) %>%
  mutate(across(c(sf_duration, collision_count, crowd_count, up_timestamps, down_timestamps), .fns =  function(x) if_else(is.na(x),lag(x, 1), x))) %>%
  filter(!is.na(response)) %>%
  ggplot(aes(response, crowd_count )) + facet_wrap(.~task) +
  geom_boxplot() +
  geom_jitter(alpha = 0.2)


