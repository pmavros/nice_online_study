## Preparing Demographic data ##
##
## in prolific, demographic data are provided, in anonymised form, by the platform,
## so we can streamline the questions we ask in our survey.
## in this script, we collate data from the various data collection runs, clean-up it up and export a single fle.


files <- list.files("../../5_data/1_Online_study/Demographic Data/", pattern = ".csv", recursive = TRUE, full.names = T)

files <- files[str_detect(files, pattern = "prolific_export")]

# 60cd1ff207ff7debb877b805

#
rm(demographics_raw)
demographics_raw <- files %>%
  map_dfr(., function(x) read_csv(x, col_names = TRUE, cols(.default = "?", Age = "c")))


demographics_raw <- demographics_raw %>%
  mutate(Participant = `Participant id`,
         Employment_status = `Employment status`,
         Nationality,
         Approval_rate =`Approval rate`,
         `Ethnicity`,
         Ethnicity_simplified = `Ethnicity simplified`,
         Student_status = `Student status`) %>%
  filter(Participant %in% unique(df_pruned$Participant)) %>%
  mutate(Ethnicity = if_else(is.na(Ethnicity), Ethnicity_simplified, Ethnicity))

demographics_raw %>%
  filter(Participant %in% c("60e431d661bec8557f292aa6", "60cd1ff207ff7debb877b805", "6096d4f033065a81bb967461")) %>%
  select(Participant, Employment_status, Student_status) %>%
  arrange(Participant)

# write_csv(demographics_raw, "data/demographics_raw.csv")


demographics_clean <- read_csv(file = "data/clean_demographics_2.csv") %>% select(-"...1")
demographics_clean

missing_data <- read_csv("../../5_data/1_Online_study/Demographic Data/Prolific - Missing information (Responses) - Form responses.csv")

demographics_clean <- demographics_clean %>%
  left_join(demographics_raw,   by= "Participant") %>%
  left_join(missing_data,   by= "Participant") %>%
  filter(Participant %in% unique(df_pruned$Participant))

# write_csv(demographics_clean, "data/demographics_merged.csv")
demographics_clean <- read_csv("data/demographics_merged.csv")

demographics_clean
