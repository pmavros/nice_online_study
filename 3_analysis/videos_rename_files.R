# Script to clean-up names of videos
# Some of the videos we used include special characters in their filename



folder = "~/Desktop/"
f <- list.files(folder, pattern = ".mp4", full.names = FALSE)
f
files_to_rename = tibble( "from"= f)
files_to_rename

files_to_rename <- files_to_rename %>%
  select(from) %>%
  mutate(to = str_replace_all(from, pattern = " ", replacement = "_")) %>%  # convert white space to _
  mutate(to = str_replace_all(to, pattern ="[()]", replacement = "")) %>% # remove ()
  mutate(to = str_replace_all(to, pattern ="\\[|\\]|\\'", replacement = "")) %>%  # remove sqare brackets
  mutate(to = str_replace_all(to, pattern ="_-_|-_", replacement = "-")) # clean up "_-_" or "-_" to simply "-"
files_to_rename

file.rename( from = paste0(folder, files_to_rename$from), to = paste0(folder, files_to_rename$to))


