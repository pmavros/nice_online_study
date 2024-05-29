
library(patchwork)
library(tidyverse)

col_urban = "#FFC125" #
col_green = "#40B0A6"
col_ps = "#d44255"


d <- read_csv("stimuli_scripts/final_set_with_testing_groups_typology_240506.csv")

d |>
  group_by(Country, City) |>
  tally() |>
  mutate(City = paste(City, " (",n, ")", sep = "")) |>
  mutate(Country = paste(Country, " (",sum(n), ")", sep = "")) |>
  group_by(Country) |>
  summarise(  `City (n stimuli)` = paste(City, collapse = ", ")) |>
  print(n = 100) |>
  xtable::xtable()

df <- read_csv("data/data_pruned_for_analysis_2024-04-26.csv")
participant_nationality <- df %>%
    group_by(Anonymised_ID) %>%
    dplyr::slice(1) %>%
    mutate(Nationality = recode(Nationality,
                                "USA" = "United States",
                                "Czech Republic" = "Czech Rep.",
                                "Venezuela, Bolivarian Republic of"="Venezuela" )) %>%
    ungroup() %>%
    count(Nationality, name = "n_per_country")


library(gt)

participant_nationality %>% arrange(n_per_country) %>% print(n = 100)


participant_nationality |>
  group_by(n_per_country) |>
  summarise(Countries = paste(Nationality, collapse = ", ")) |>
  arrange(desc(n_per_country)) |>
  xtable::xtable() |>
  print(include.rownames = F)


