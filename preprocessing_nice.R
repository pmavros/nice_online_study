library(dplyr)
library(tidyverse)
library(tidyr)
library(jsonlite)
library(tidyjson)
library(purrr)

preprocess_NICE <- function(file){
  # Read Data (replace path with your own file directory)
  df <- read.csv(file)
  
  # Get Variables we want 
  scales <- c('willingnesstowalk', 
              'emotions', 
              'presence', 
              'being_away',
              'aesthetic_visit',
              'feedback',
              'sf_task',
              'sf_reaction_stress',
              'sf_reaction_enjoyable',
              'preference_for_crowds',
              'nss_sf',
              'sias6_sf',
              'sps_sf',
              'ipip6'
  )  
  
  data <- df[df$task %in% scales, ] |>
    select(subject_id, condition, time_elapsed, task, rt)

  # Function to extract nested JSON survey answers from CSV file
  extract_response <- function (task){
       response <- df  |>
            filter({{task}}==task, !is.na(response), response!='null') |>
            select(response, subject_id) |>
            group_by(subject_id) |>
            unnest(cols=response) |>
            separate_rows(response, sep=',') |>
            separate(response, into = c('Qn', 'Ans'), sep=':') |>
            select(Ans, subject_id)|>
            as.data.frame() |>
        #pull('ans', 'subject_id') |>
            mutate(across(everything(),~ gsub("[[:punct:]]", "", .))) |>
       rename(!!paste0(as.character(task), '_Ans'):=Ans)
       response
  }

  # Measures Used that display JSON-format results
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
  
  ##ToDo: Add the rest of the scales here  
  
  # Extract all JSON Results 
  JSON_measures <- c('emotions', 'sps_sf')
  
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

# RUN
df_all <- preprocess_NICE('Prolific_data/nice-online-experiment-working 20220623.csv')

  
  
   
      
  


  
  

  

