

#########################
# PEOPLE LOCATIONS #######
#########################

# geocode
install.packages("tidygeocoder")
library(tidygeocoder)

demog <- data.frame(files = list.files("../../5_data/1_Online_study/Demographic Data/", pattern = ".csv", full.names = T)) |>
  filter(str_detect(files, negate = TRUE, pattern = "Missing information"))

cols_to_parse <- c("Submission id",  "Participant id",   "Status","Time taken", "Approval rate", "Fluent languages", "Age", "Sex", "Ethnicity", "Country of birth", "Country of residence", "Nationality", "Language", "Student status", "Employment status")

demog <- demog %>%
  pull(files)%>%
  map_df(., function(x) read_csv(x, col_types = cols(.default = "c")))

demog

approved <- read_csv(file = "data/clean_demographics_2.csv")

demog <- demog %>%
  filter(`Participant id` %in% approved$subject_id) %>%
  left_join(approved, by = c("Participant id" = "subject_id"))

missing_data <- read_csv("../../5_data/1_Online_study/Demographic Data/Prolific - Missing information (Responses) - Form responses.csv")
missing_data

# AGE ####
demog %>%
  select(Age.x, Age.y) %>%
  filter(Age.x %in% c("CONSENT_REVOKED", "DATA_EXPIRED") ) %>%
  print(n = 500)

# ETHNICITY ####
demog %>%
  mutate(Ethnicity = if_else(is.na(Ethnicity), `Ethnicity simplified`, Ethnicity) ) %>%
  select(`Participant id`, Ethnicity, `Ethnicity simplified`)  %>%
  filter(Ethnicity %in% c("CONSENT_REVOKED", "DATA_EXPIRED") ) %>%
  left_join(missing_data, by = c("Participant id" = "Participant"))

# employment information
# 7 missing as of September 2, but have messaged all in prolific
demog %>%
  filter(`Employment status` %in% c("CONSENT_REVOKED", "DATA_EXPIRED") ) %>%
  left_join(missing_data, by = c("Participant id" = "Participant")) %>%
  select(`Participant id`, Age.y,`Employment status.x`,`Employment status.y`, `Student status.x`, `Student status.y`)  %>%
  filter(is.na(`Employment status.x`)  |is.na(`Student status.x`))




data$`Country of residence` %>% table()
tidygeocoder::geo()

test_geo <- df %>%
  group_by(subject_id) %>%
  slice(1) %>%
  ungroup() %>%
  select(subject_id, Grow.up.City, Grow.up.country) %>%
  separate(Grow.up.City, into = c("Grow.up.City", NA),sep = "," )  %>%
  filter(!is.na(Grow.up.City))

test_geo <- geo(city = test_geo$Grow.up.City, country =  test_geo$Grow.up.country)




#########################
# VIDEO LOCATIONS #######
#########################

places <- read_csv("../../3_materials/stimuli_scripts/final_set_with_testing_groups typology.csv")

places
places_geo <- geo(city = places$City, country =  places$Country)

write_csv(places_geo, file = "../../3_materials/stimuli_scripts/")
