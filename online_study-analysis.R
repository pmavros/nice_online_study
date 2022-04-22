

library(tidyverse)

files <- list.files(path = "~/Downloads/", pattern = "nice-online-experiment-working",
                    full.names = T)
files
survey <- map_df("/Users/panosmavros/Downloads//nice-online-experiment-working.csv", read_csv, .id = "source",  show_col_types = FALSE)
survey
