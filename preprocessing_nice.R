library(dplyr)
library(tidyverse)
library(tidyr)
library(jsonlite)
library(tidyjson)
library(purrr)

# This is a preprocessing function to extract variables into a single data frame for the NICE online study.
# Variables to extract can be customized by commenting out or inserting your own variables in `scales`
# Nested JSON-formatted results can be extracted from .csv files using this function

preprocess_NICE <- function(file){
  # Read Data (replace path with your own file directory)
  df <- read.csv(file)

  # Get all variables we want

  ## List of non-JSON formatted scales to extract
  nonJSON_scales <- c('willingnesstowalk',
                        'presence',
                        'being_away',
                        'sf_reaction_stress',
                        'sf_reaction_enjoyable',
                        )

  data <- df[df$task %in% nonJSON_scales, ] |>
    select(subject_id, condition, task, stimulus, response, rt)

  # Function to extract nested **JSON** survey answers from CSV file
  extract_response <- function (task){
       response <- df  |>
            filter({{task}}==task, !is.na(response), response!='null') |>
            select(response, subject_id, rt) |>
            group_by(subject_id) |>
            unnest(cols=response) |>
            separate_rows(response, sep=',') |>
            separate(response, into = c('Qn', 'Ans'), sep=':') |>
            select(Ans, subject_id, rt)|>  # include any other variables here
            as.data.frame() |>
        #pull('ans', 'subject_id') |>
            mutate(across(everything(),~ gsub("[[:punct:]]", "", .))) |>
       rename(!!paste0(as.character(task), '_Ans'):=Ans) |>
       rename(!!paste0(as.character(task), '_RT'):=rt)

       response
  }

  # Measures Used that display **JSON-format** results
  aesthetic_visit <- c("narrow-wide",
                          "empty-crowded",
                          "chaotic-order",
                          "ugly-beauty",
                          "boring-interesting",
                          "unfamiliar-familiar",
                          "dull-scenic")

  emotions <- c("positive-negative",
                  "calm-excited")

  sias6_sf <- c("I have difficulty making eye-contact with others.",
                "I find difficulty mixing comfortably with the people I work with.",
                "I tense up if I meet an acquaintance in the street.",
                "I feel tense if I am alone with just one other person.",
                "I have difficulty talking with other people.",
                "I find it difficult to disagree with anotherâ€™s point of view.")


  sps_sf <- c("I get nervous that people are staring at me as I walk down the street.",
              "I worry about shaking or trembling when I'm watched by other people.",
              "I would get tense if I had to sit facing other people on a bus or a train.",
              "I worry I might do something to attract the attention of others.",
              "When in an elevator I am tense if people look at me.",
              "I can feel conspicuous standing in a queue.")

  nss_sf <- c("nss_sf")

  ipip6 <- c("I am the life of the party.",
             "I sympathize with others’ feelings.",
             "I get chores done right away. ",
             "I have frequent mood swings. ",
             "I have a vivid imagination. ",
             "I feel entitled to more of everything.",
             "I don’t talk a lot.",
             "I am not interested in other people’s problems.",
             "I have difficulty understanding abstract ideas.",
             "I like order.",
             "I make a mess of things.",
             "I deserve more things in life.",
             "I do not have a good imagination.",
             "I feel others’ emotions.",
             "I am relaxed most of the time.",
             "I get upset easily.",
             "I seldom feel blue.",
             "I would like to be seen driving around in a very expensive car.",
             "I keep in the background.",
             "I am not really interested in others.",
             "I am not interested in abstract ideas.",
             "I often forget to put things back in their proper place.",
             "I talk to a lot of different people at parties.",
             "I would get a lot of pleasure from owning expensive luxury goods.")

  ## TO-DO: include in surveys with random question order
  # preference_for_crowds <- c("I like being in crowded places.",
  #                       "During my leisure time, enjoy walking downtown among pedestrian crowds.",
  #                       "During my commute, I like being in a crowded public transport")
  #
  # concern_for_covid <- c("Contracting COVID-19 is something that worries me when I am in a crowd.",
  #                     "When I am in public spaces, I pay a lot of attention if people are wearing their masks.",
  #                     "Because of COVID, I avoid going to busy locations like downtown, shop, or malls.",
  #                     "I think when you are outdoors there is not a lot of risk to contract COVID.")

  stimulus_screening_ability <- c("I am strongly emotionally moved when many things are happening at once.",
                                  "The mood of a physical setting affects me a lot.",
                                  "A sudden strong odour can have a great influence on me.",
                                  "When I walk into a crowded room, it immediately has a big effect on me.",
                                  "Strong foul odours can make me tense.",
                                  "I am tremendously affected by sudden loud noises.",
                                  "I am excitable in a crowded situation.",
                                  "It is easy to feel agitated when a lot is happening.",
                                  "I don't react much to sudden odd sounds.",
                                  "My moods are not quickly affected when I enter new places.")

  demographic <- c("Age",
                   "ArchitectureBackground",
                   "Arts_bacground",
                   "Urban_Rural",
                   "Grow-up country",
                   "Grow-up City",
                   "Lives_now",
                   "years_Lives_now")


  ##ToDo: Add the rest of the scales here

  # Extract **JSON measures** that you want here
  JSON_measures <- c('demographic',
                     'emotions',
                     'aesthetic_visit',
                     'sps_sf',
                     'nss_sf',
                     'sias6_sf',
                     'ipip6',
                     'stimulus_screening_ability')

  # all_responses <- data.frame(df$subject_id)
 #  colnames(all_responses) = 'subject_id'

  scale_list <- list()
  for (i in JSON_measures){
    var <- extract_response(as.character(i))
    out <- merge(data.frame(get(i)), var)
    colnames(out)[1] = as.character(i)
    #assign(paste0("scale_", as.name(i)), out)
    scale_list[[i]] <- out
  }

  # Function to Merge Dataframes quickly without looping
  mymerge <- function(df1, df2){
    merge(df1,df2, by='subject_id', all=TRUE)
  }

  all_responses <- Reduce(mymerge, scale_list)

  # Merge all the data into one data frame
  all_data <- Reduce(mymerge,list(all_responses, data))
  all_data

}

# RUN =======================
df_all <- preprocess_NICE('Prolific_data/nice-online-experiment-working 20220623.csv')

