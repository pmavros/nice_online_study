require(googledrive)
require(tidyverse)
require(jsonlite  )

# drive <- drive_ls("https://drive.google.com/drive/u/3/folders/1XSaTzLr0bJayLWTfxiL5OXMtDUcDZYpX", recursive = T)

unpack_pose_json <- function(f) {
  err = 'good'
  d <- tryCatch(
      jsonlite::read_json(simplifyVector = T, f), error = function(e)  {   print(paste("error at:", f))         } )
  d <- data.frame(filename = f,
                  ped_counts = ifelse( typeof(d) != "list", NA, length(unlist(d$people$person_id))))
  d
}

video <- list.files(path = "/Users/panosmavros/Dropbox/FCL_Panos/01_Projects/NICE/NICE_Group-Folder/3_materials/stimuli/nice_pose_data/",
                    full.names = T, recursive = T,
                    pattern = ".json")
length(video)

ped_count <- data.frame(filename = "f", ped_counts = 0)[0]
ped_count

rm(data_pose)
system.time(data_pose <- video %>%
              map_dfr(., unpack_pose_json))

plot(tmp$ped_counts, type = "l")

tmp

# write_csv(data_pose, "data/ped_counts_pose4.csv")



