import os

import numpy as np
import pandas as pd


# =============================================================================
# Internal Utilities
# =============================================================================
def flatten_json(data, dim):
    for x in data[dim].index:
        if type(data[dim][x]) != float:
            if len(data[dim][x]) > 1:
                data[dim][x] = eval(data[dim][x])

    data = pd.concat([data, data[dim].apply(pd.Series)], axis=1)
    return data


# =============================================================================
# Read all cognition.run files into one dataframe
# =============================================================================
df = pd.DataFrame()

path = '../../5_data/1_Online_study/Experiment Data/'
# path = '/Users/panosmavros/Dropbox/FCL_Panos/01_Projects/NICE/NICE_Group-Folder/5_data/1_Online_study/Experiment Data'

# outliers = ['6125f50ded05374a0393199f',
#             '5fdf808af53c7a7e9199b430',
#             '6124c2a661f3a44f8c7c7f25']

#for f in os.listdir( data_dir ):
for f in os.listdir(path):
    if f.endswith(".csv"):
        # if not '_finishedruns.csv' in f:
        # if not 'Block_10_finished' in f and not 'block_11_finished' in f:
        # raw = pd.read_csv( os.path.join(base_dir, "5_data/1_Online_study/Experiment Data/" + f))
        raw = pd.read_csv(path + f)
        raw['filename'] = f
        # if raw[raw['subject_id']].isin(outliers):
            # print(raw)
        df = pd.concat([df, raw], axis=0)


# Find total number of participants from cognition.run
# len(df['PROLIFIC_PID'].unique())
# total no. = 506  (note this includes some files with all runs)

# =============================================================================
# ---------------------------Filtering----------------------------------------
# =============================================================================

# -- Filter out participants who didn't finished experiment-------------------
# Create unique identifier (note: some ppts have same subject and session ids across multiple sessions)
df['unique'] = df['subject_id'] + df['session_id'] + df['recorded_at']
temp = df.loc[df["stimulus"].str.contains("The end!") == True]
#temp2 = temp['unique']
#df = df[df['unique'].isin(temp)]
valid_id = temp["unique"].unique()  # Get valid participant IDs

df = df.loc[df["unique"].isin(valid_id)]

# total number of participants that make it to end of experiment
# len(valid_id)
# total valid participants = 408 (2 ppts with 2 diff session ids dropped later)

# -- Filter out participants that did expt > 1 using session ID----------------
check_id = temp["subject_id"].value_counts()
check_id = list(check_id[check_id > 1].index)
check = df.loc[df["subject_id"].isin(check_id)]

# Get session ids of first run
valid_sess = pd.DataFrame()
for p in check_id:
    val = check[check["subject_id"] == p]
    val = val["session_id"].unique()[0]
    valid_sess = pd.concat([valid_sess, pd.Series(val)], axis=0)
   # valid_sess = valid_sess.drop_duplicates()


# Drop all runs after the first
to_drop = check[~check["session_id"].isin(list(valid_sess.iloc[:, 0]))]
to_drop = to_drop["session_id"]
df = df[~df["session_id"].isin(to_drop)]
df = df.drop_duplicates()
# unique_runs = df[['subject_id', 'session_id', 'recorded_at', 'filename']].drop_duplicates()

# check_id = ["60cc20a8d1d940dcfa9df92d", "613bd3a683a2ac56a4119aa6"]
# dropped sessions = ['62de24518a89df11e0713575', '62de3450ceb3e904d94b50b5']


# -- Filter out participants that were not engaged when watching videos-------------
valid_vid = df[["subject_id", "video", "stimulus", "event", "time_elapsed", "task"]]
valid_vid["Time_Watching"] = pd.Series(np.nan)

# Compute total time spent watching each video
# Note: task = 'fixation' when video starts and 'buffer' when video ends
keep = ["fixation", "buffer"]
drop = ["blur", "focus", "fullscreenexit"]
time_temp = valid_vid[valid_vid["task"].isin(keep)]
time_temp["Time_Watching"] = np.nan

# Convert 'fixation' and 'buffer' tasks to nans when event is blur/focus/fullscreen (extra rows formed); event is nan if video is playing and participant is engaged (i.e., not switching tabs)
for n in range(len(time_temp) - 1):
    if time_temp["event"].iloc[n] in drop:
        time_temp["task"].iloc[n] = np.nan

time_temp = time_temp.dropna(subset="task")

# Compute time elapsed between fixation and buffer as time taken to watch 1 video
# Note that when video ends, 'video' column is nan
for n in range(len(time_temp) - 1):
    # Check if same participant is watching
    if time_temp["subject_id"].iloc[n] == time_temp["subject_id"].iloc[n + 1]:
        # Check that time is not computed for demo videos (i.e., video is nan)
        if (time_temp["task"].iloc[n] == "fixation") & (
            pd.isna(time_temp["video"].iloc[n]) == False
        ):
            # if time_temp['stimulus'].str.contains('/+').iloc[n]==True:
            # if time_temp['event'].iloc[n] not in drop:
            time_temp["Time_Watching"].iloc[n] = (
                time_temp["time_elapsed"].iloc[n + 1] - time_temp["time_elapsed"].iloc[n]
            )

# Add time taken to watch each video as new column
time_watch = time_temp.dropna(subset="Time_Watching")
time_watch = time_watch.drop(columns=["stimulus", "event", "time_elapsed", "task"])

# check_vid= time_watch['subject_id'].value_counts()

# Compute differences in time elapsed as time distracted when watching video
distracted_events = df[["subject_id", "video", "stimulus", "event", "time_elapsed", "task"]]
keep_task = ["fixation", "stimulus", "buffer"]
distracted_events = distracted_events[distracted_events["task"].isin(keep_task)]
distracted_events["Distracted_Time"] = np.nan
# x = ['blur', 'fullscreenexit']
# distracted_events['event'] = distracted_events['event'].fillna('nan')


for n in range(len(distracted_events) - 1):
    # check if same participant is watching
    if distracted_events["subject_id"].iloc[n] == distracted_events["subject_id"].iloc[n + 1]:
        # check that amount of time spent distracted is computed for same video
        if distracted_events["video"].iloc[n] == distracted_events["video"].iloc[n + 1]:
            # Case 1: time elasped between 'blur'/'fullscreenexit' and 'fixation' is computed
            if (
                distracted_events["event"].iloc[n] == "blur"
                or distracted_events["event"].iloc[n] == "fullscreenexit"
            ) and distracted_events["event"].iloc[n + 1] == "focus":
                distracted_events["Distracted_Time"].iloc[n] = (
                    distracted_events["time_elapsed"].iloc[n + 1]
                    - distracted_events["time_elapsed"].iloc[n]
                )
            # Case 2: time elasped between n='blur'/'fullscreenexit' and n+2='focus' when n+1= 'nan'
            elif (
                distracted_events["event"].iloc[n] == "blur"
                or distracted_events["event"].iloc[n] == "fullscreenexit"
            ) and (
                pd.isna(distracted_events["event"].iloc[n + 1]) == True
                and distracted_events["event"].iloc[n + 2] == "focus"
            ):
                distracted_events["Distracted_Time"].iloc[n] = (
                    distracted_events["time_elapsed"].iloc[n + 2]
                    - distracted_events["time_elapsed"].iloc[n]
                )
            # Case 3: time elasped between n='blur'/'fullscreenexit' and n+2='buffer' when n+1= 'nan'
            elif (
                distracted_events["event"].iloc[n] == "blur"
                or distracted_events["event"].iloc[n] == "fullscreenexit"
            ) and (
                pd.isna(distracted_events["event"].iloc[n + 1]) == True
                and distracted_events["task"].iloc[n + 2] == "buffer"
            ):
                distracted_events["Distracted_Time"].iloc[n] = (
                    distracted_events["time_elapsed"].iloc[n + 2]
                    - distracted_events["time_elapsed"].iloc[n]
                )
            # elif (distracted_events['event'].iloc[n] == 'fullscreenexit' and pd.isna(distracted_events['event'].iloc[n + 1]) == True) and distracted_events['task'].iloc[n + 2] == 'buffer':
            #     distracted_events['Distracted_Time'].iloc[n] = (
            #     distracted_events['time_elapsed'].iloc[n + 2] - distracted_events['time_elapsed'].iloc[n]
            #     )
            # Case 4: time elasped between n='fullscreenexit/blur' and n+1='blur/fullscreeenexit'
            elif (
                distracted_events["event"].iloc[n] == "fullscreenexit"
                and distracted_events["event"].iloc[n + 1] == "blur"
            ) or (
                distracted_events["event"].iloc[n] == "blur"
                and distracted_events["event"].iloc[n + 1] == "fullscreenexit"
            ):
                distracted_events["Distracted_Time"].iloc[n] = (
                    distracted_events["time_elapsed"].iloc[n + 1]
                    - distracted_events["time_elapsed"].iloc[n]
                )
            # elif (distracted_events['event'].iloc[n] == 'blur' and distracted_events['event'].iloc[n + 1] == 'fullscreenexit') and distracted_events['event'].iloc[n+2] == 'focus':
            #     distracted_events['Distracted_Time'].iloc[n] = (
            #     distracted_events['time_elapsed'].iloc[n + 2] - distracted_events['time_elapsed'].iloc[n]
            #     )
            # Case 5: fixes case where blur event occurs in fixation tasks before fixation cross appears and no focus event occurs during stimulus task (when video is playing)[ time elapsed between n='blur' and n+3='buffer' when task^n= 'fixation']
            elif (
                distracted_events["event"].iloc[n] == "blur"
                and pd.isna(distracted_events["event"].iloc[n + 1]) == True
            ) and (
                pd.isna(distracted_events["event"].iloc[n + 2]) == True
                and distracted_events["task"].iloc[n + 3] == "buffer"
            ):
                distracted_events["Distracted_Time"].iloc[n] = (
                    distracted_events["time_elapsed"].iloc[n + 3]
                    - distracted_events["time_elapsed"].iloc[n]
                )

distracted_total = (
    distracted_events.groupby(["subject_id", "video"])["Distracted_Time"].sum().reset_index()
)


# Identify participants that spent > 45s (over 1.5X video length) watching > 15 videos (out of 30)
# time_drop = time_watch[time_watch["Time_Watching"] > 45 * 1000]
# out = time_drop["subject_id"].value_counts()
# drop_ppt = list(out[out > 15].index)
# # len(drop_ppt) = 20

# # Identify participants that spent > 100s (more than 3 times video length) watching > 3 videos
# drop_vid = time_watch[time_watch["Time_Watching"] > 100 * 1000]
# to_drop = drop_vid["subject_id"].value_counts()
# to_drop = list(to_drop[to_drop > 3].index)
# # len(to_drop) = 12

# # Identify outlier that spent <20s (less than 2/3 of video) for all videos
# out_ppt = time_watch[time_watch["Time_Watching"] < 20 * 1000]
# out_ppt = list(out_ppt["subject_id"].unique())  # dropped 1 participant

# # 5d0cd09edff7d70019e6e045 spent <20s on all 30 videos


# # ----------Filter out distracted/ non-immersed participants-------------------------
# # Remove duplicates in participants to filter
# total_drop = drop_ppt + list(set(to_drop) - set(drop_ppt)) + out_ppt

# # Final set of participants included in analysis
# df = df[~df["subject_id"].isin(total_drop)]  # 26 participants dropped in total (out of 355)


# # Find total distracted time per video for each participant
# distracted_total = (
#     valid_vid.groupby(["PROLIFIC_PID", "video"])["Time_Distracted"].sum().reset_index()
# )
# distracted_total = distracted_total.rename(columns={"Time_Distracted": "Total_Distracted_Time"})

# # Find number of videos ppts were distracted watching
# distracted_videos = distracted_total[distracted_total["Total_Distracted_Time"] > 0]  # 52 in total
# distracted_counts = distracted_videos["PROLIFIC_PID"].value_counts()
# # distract_events = valid_vid[valid_vid["event"] == "blur"]
# # distracted_counts = distract_events["PROLIFIC_PID"].value_counts()

# # Find total distraction time per video of ppts that were distracted for 4 or more videos
# distracted_ppt = distracted_total[
#     distracted_total["PROLIFIC_PID"].isin(distracted_counts[distracted_counts > 4].index)
# ]

# # Filter out participants that were distracted for > 15s for each video for 4 or more videos
# distracted_ppt = distracted_ppt[distracted_ppt["Total_Distracted_Time"] > 15 * 1000]
# n_distracted_vid = distracted_ppt["PROLIFIC_PID"].value_counts()

# drop_ppt = distracted_ppt[
#     distracted_ppt["PROLIFIC_PID"].isin(n_distracted_vid[n_distracted_vid > 3].index)
# ]
# drop_ppt = drop_ppt["PROLIFIC_PID"].unique()  # 6 people dropped here


# EXTREME OUTLIERS
# Note that some people seem to take an extremely long time when watching 1 video (total sum of time elapsed between blur and focused events are extremely long)
# outliers = ['62e15c4a692e10bbbf11284e',  # 192 seconds
#             '5dec460a8d43d9346487f840',   # 335 seconds
#             '5aebc5a8aa05510001ff675d',   # 98 seconds
#              '5abd0b935cd105000161ea7b']   # 1446.2 seconds

# drop_ppt = pd.DataFrame()
# for p in dis_ppt["PROLIFIC_PID"].unique():
#     p_vid = dis_ppt[dis_ppt["PROLIFIC_PID"]==p]
#     vid = p_vid['video']
#     n_vid = len(vid.unique())
#     if n_vid>5:
#         p = pd.Series(p)
#         drop_ppt= pd.concat([drop_ppt, p], axis=0)
# drop_ppt = np.array(drop_ppt.iloc[:, 0])


# =============================================================================
# -------------------------- Behavioural Responses----------------------------
# =============================================================================
# Select columns of interest
cols = ["subject_id", "task", "response", "video"]
tasks = ["willingnesstowalk", "emotions", "presence", "being_away", "aesthetic_visit"]

behav_data = df[cols]
behav_data = behav_data.loc[behav_data["task"].isin(tasks)]

# Fill Nans in Time distracted with 0
# behav_data[["Time_Distracted"]] = behav_data[["Time_Distracted"]].fillna(int(0))
# behav_data = behav_data.dropna(subset=["video"])

# Drop Missing Responses and demo videos
behav_data = behav_data.dropna(subset=["response", "video"])

# Transpose data
behav_data = behav_data.pivot_table(
    index={"subject_id", "video"}, columns="task", values="response", aggfunc="sum", sort=False
).reset_index()

# Flatten Data in Aesthetics_visit and Emotions
behav_data = flatten_json(behav_data, "aesthetic_visit")
behav_data = flatten_json(behav_data, "emotions")
behav_data = behav_data.iloc[:, :-1]  # remove last column with all NaN values

beh = behav_data.drop(["aesthetic_visit", "emotions"], axis=1)

# Insert time spent watching each video
# vid_time = time_watch[time_watch["subject_id"].isin(behav_data["subject_id"].unique())]
# vid_time = vid_time[["subject_id", "video", "Time_Watching"]]

beh = pd.merge(beh, time_watch, on=["subject_id", "video"])
beh = pd.merge(beh, distracted_total, on=["subject_id", "video"])

# dx = df[["subject_id", "video", "Time_Distracted"]]
# dx = dx.dropna(subset="video")
# dx = dx.pivot_table(index={"subject_id", "video"}, values="Time_Distracted").reset_index()
# beh = beh.merge(dx, on=["subject_id", "video"])


# ========================================================================================
# ------------------------Personality and Demographics-----------------------------------
# ========================================================================================
# Select columns of interest
cols = ["subject_id", "task", "response"]
questionnaires = [
    "preference_for_crowds",
    "concern_for_covid",
    "stimulus_screening_ability",
    "nss_sf",
    "sias6_sf",
    "ipip6",
    "sps_sf",
    "demographics",
]

dx = df[cols]
per_data = dx.loc[dx["task"].isin(questionnaires)]

# Drop Missing Responses
per_data = per_data.dropna()

# Transpose data
per_data = per_data.pivot_table(
    index="subject_id", columns="task", values="response", aggfunc="sum", sort=False
).reset_index()


# -------------------------------- Flatten JSON Data ----------------------------------
# ===================================================================================
# -------------------------Stimulus Screening Ability-------------------------------
# ===================================================================================
per_data = flatten_json(per_data, "stimulus_screening_ability")

ssa = {
    "I am strongly emotionally moved when many things are happening at once.": "stim_screen_1",
    "The mood of a physical setting affects me a lot.": "stim_screen_2",
    "A sudden strong odour can have a great influence on me.": "stim_screen_3",
    "When I walk into a crowded room, it immediately has a big effect on me.": "stim_screen_4",
    "Strong foul odours can make me tense.": "stim_screen_5",
    "I am tremendously affected by sudden loud noises.": "stim_screen_6",
    "I am excitable in a crowded situation.": "stim_screen_7",
    "It is easy to feel agitated when a lot is happening.": "stim_screen_8",
    "I don’t react much to sudden odd sounds.": "stim_screen_9",
    "My moods are not quickly affected when I enter new places.": "stim_screen_10",
}

per_data = per_data.rename(columns=ssa)
per_data = per_data.drop(["stimulus_screening_ability"], axis=1)

# Format columns
per_data.loc[:, "stim_screen_1":"stim_screen_10"] = per_data.loc[
    :, "stim_screen_1":"stim_screen_10"
].astype("int")

# Reverse code scores (scores range from 0-6)
per_data["stim_screen_1"] = 7 - per_data["stim_screen_1"]
per_data["stim_screen_2"] = 7 - per_data["stim_screen_2"]
per_data["stim_screen_3"] = 7 - per_data["stim_screen_3"]
per_data["stim_screen_4"] = 7 - per_data["stim_screen_4"]
per_data["stim_screen_5"] = 7 - per_data["stim_screen_5"]
per_data["stim_screen_6"] = 7 - per_data["stim_screen_6"]
per_data["stim_screen_7"] = 7 - per_data["stim_screen_7"]
per_data["stim_screen_8"] = 7 - per_data["stim_screen_8"]

# Compute Score (7 point Likert Scale)
per_data["SSA_Mean"] = per_data.loc[:, "stim_screen_1":"stim_screen_10"].mean(axis=1)


# =============================================================================
# ----------------------------Covid Concern-----------------------------------
# =============================================================================
per_data = flatten_json(per_data, "concern_for_covid")

per_data = per_data.rename(columns={"1": "covid_1", "2": "covid_2", "3": "covid_3", "4": "covid_4"})
per_data = per_data.drop(columns=["concern_for_covid"])

# Reverse Code (scores range from 0-6)
per_data["covid_4"] = 7 - pd.to_numeric(per_data["covid_4"])

# Format Columns and Compute Score (7 point Likert Scale)
per_data["covid_1"] = pd.to_numeric(per_data["covid_1"])
per_data["covid_2"] = pd.to_numeric(per_data["covid_2"])
per_data["covid_3"] = pd.to_numeric(per_data["covid_3"])
per_data["Concern_Covid_Mean"] = per_data.loc[:, "covid_1":"covid_4"].mean(axis=1)


# ===================================================================================
# --------------------------Social Interaction Anxiety-------------------------------
# ===================================================================================
per_data = flatten_json(per_data, "sias6_sf")

sias = {
    "I have difficulty making eye-contact with others.": "sias1",
    "I find difficulty mixing comfortably with the people I work with.": "sias2",
    "I tense up if I meet an acquaintance in the street.": "sias3",
    "I feel tense if I am alone with just one other person.": "sias4",
    "I have difficulty talking with other people.": "sias5",
    "I find it difficult to disagree with another’s point of view.": "sias6",
}

per_data = per_data.rename(columns=sias)
per_data = per_data.drop(columns=["sias6_sf"])

# Compute scores for SIAS-sf (7 point Likert Scale)
per_data["SIAS_Total_Mean"] = per_data.loc[:, "sias1":"sias6"].mean(axis=1)


# =============================================================================
# --------------------------Social Phobia------------------------------------
# =============================================================================
per_data = flatten_json(per_data, "sps_sf")

sps = {
    "I get nervous that people are staring at me as I walk down the street.": "sps1",
    "I worry about shaking or trembling when I’m watched by other people.": "sps2",
    "I would get tense if I had to sit facing other people on a bus or a train.": "sps3",
    "I worry I might do something to attract the attention of others.": "sps4",
    "When in an elevator I am tense if people look at me.": "sps5",
    "I can feel conspicuous standing in a queue.": "sps6",
}

per_data = per_data.rename(columns=sps)
per_data = per_data.drop(columns=["sps_sf"])

# Compute scores for SPS-sf (7 point Likert Scale)
per_data["SPS_Total_Mean"] = per_data.loc[:, "sps1":"sps6"].mean(axis=1)


# =============================================================================
# ----------------------------Mini IPIP---------------------------------------
# =============================================================================
per_data = flatten_json(per_data, "ipip6")

# Reverse Code Items on 7 point Likert Scale (scores range from 0 - 6)
reverse_coded_items = [
    "5",
    "6",
    "7",
    "8",
    "10",
    "11",
    "12",
    "14",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "23",
]

rev = pd.DataFrame()
for label in per_data.columns:
    if label in reverse_coded_items:
        rev = pd.concat([rev, per_data.loc[:, label]], axis=1)

for col in rev.columns:
    rev[col] = 7 - rev[col]

per_data = per_data.drop(columns=reverse_coded_items)
per_data = pd.concat([per_data, rev], axis=1)


# Compute Scores for Each Dimension
per_data["ipip_Extroversion"] = per_data[["0", "6", "18", "22"]].mean(axis=1)
per_data["ipip_Agreeableness"] = per_data[["1", "7", "13", "19"]].mean(axis=1)
per_data["ipip_Conscientiousness"] = per_data[["2", "9", "10", "21"]].mean(axis=1)
per_data["ipip_Neuroticism"] = per_data[["3", "14", "15", "16"]].mean(axis=1)
per_data["ipip_Openness"] = per_data[["4", "8", "12", "20"]].mean(axis=1)
per_data["ipip_Honesty"] = per_data[["5", "11", "17", "23"]].mean(axis=1)

# Rename Columns
per_data = per_data.rename(columns={"0": "Extraversion_1"})
per_data = per_data.rename(columns={"1": "Agreeableness_2"})
per_data = per_data.rename(columns={"2": "Conscientiousness_3"})
per_data = per_data.rename(columns={"3": "Neuroticism_4"})
per_data = per_data.rename(columns={"4": "Openness_5"})
per_data = per_data.rename(columns={"5": "HonestyHumility_6_R"})
per_data = per_data.rename(columns={"6": "Extraversion_7_R"})
per_data = per_data.rename(columns={"7": "Agreeableness_8_R"})
per_data = per_data.rename(columns={"8": "Openness_9_R"})
per_data = per_data.rename(columns={"9": "Conscientiousness_10"})
per_data = per_data.rename(columns={"10": "Conscientiousness_11_R"})
per_data = per_data.rename(columns={"11": "HonestyHumility_12_R"})
per_data = per_data.rename(columns={"12": "Openness_13_R"})
per_data = per_data.rename(columns={"13": "Agreeableness_14"})
per_data = per_data.rename(columns={"14": "Neuroticism_15_R"})
per_data = per_data.rename(columns={"15": "Neuroticism_16"})
per_data = per_data.rename(columns={"16": "Neuroticism_17_R"})
per_data = per_data.rename(columns={"17": "HonestyHumility_18_R"})
per_data = per_data.rename(columns={"18": "Extraversion_19_R"})
per_data = per_data.rename(columns={"19": "Agreeableness_20_R"})
per_data = per_data.rename(columns={"20": "Openness_21_R"})
per_data = per_data.rename(columns={"21": "Conscientiousness_22_R"})
per_data = per_data.rename(columns={"22": "Extraversion_23"})
per_data = per_data.rename(columns={"23": "HonestyHumility_24_R"})

per_data = per_data.drop(columns=["ipip6"])


# =============================================================================
# ---------------------------Preference for Crowds ---------------------------
# =============================================================================
per_data = flatten_json(per_data, "preference_for_crowds")
per_data = per_data.rename(columns={"1": "crowds_1", "2": "crowds_2", "3": "crowds_3"})
per_data = per_data.drop(columns=["preference_for_crowds"])

# Format columns and Compute scores (5-point likert scale)
per_data["crowds_1"] = pd.to_numeric(per_data["crowds_1"])
per_data["crowds_2"] = pd.to_numeric(per_data["crowds_2"])
per_data["crowds_3"] = pd.to_numeric(per_data["crowds_3"])
per_data["Crowd_Preference_Mean"] = per_data.loc[:, "crowds_1":"crowds_3"].mean(axis=1)


# =============================================================================
# ------------------------------Demographics-----------------------------------
# =============================================================================
per_data = flatten_json(per_data, "demographics")
per_data = per_data.drop(columns=["demographics"])


# =============================================================================
# ------------------------------Noise Sensitivity------------------------------
# =============================================================================
per_data = flatten_json(per_data, "nss_sf")
per_data = per_data.set_axis([*per_data.columns[:-1], "NSS"], axis=1, inplace=False)

# Reverse Code Scores (6-point Likert scale; range: 0-5)
# Note NSS only has response of item #5 ("I get used to most noises without much difficulty")
per_data["NSS"] = 6- per_data["NSS"]
personality = per_data.drop(columns=["nss_sf"])


# =============================================================================
# ----------------------- Merge All Data Frames--------------------------------
# =============================================================================
df_total = pd.merge(beh, personality, on="subject_id")


# personality_df = pd.DataFrame(np.repeat(personality.values, len(beh) / len(personality), axis=0))
# personality_df.columns = personality.columns
# personality_df = personality.set_index("subject_id")
# beh = beh.set_index("subject_id")
# df_total = beh.merge(personality_df, right_index=True, left_index=True).reset_index()


# ====================================================================================
# -----------------------Insert Participant Information--------------------------------
# ====================================================================================
# ------------------ Insert participant conditions to df_total------------------------
cond = df.groupby("subject_id").first().reset_index()
cond = cond[["subject_id", "condition"]]
df_total = pd.merge(df_total, cond, on="subject_id")


# all_cond = pd.DataFrame(np.repeat(cond.values, len(df_total) / len(cond), axis=0))
# all_cond.columns = cond.columns
# df_total = pd.merge(df_total, all_cond, on="subject_id").drop_duplicates()


# -------------------- Insert participant screen size----------------------------
# Find screen size for participants with browser check trials
browser_check = df[df["trial_type"] == "browser-check"]
browser_check = browser_check.groupby("subject_id").last().reset_index()
size = browser_check[["subject_id", "width", "height"]]

# Note 61 participants don't have trials with browser check
# Create data frame with nans for participants with no screen size found
p = browser_check["subject_id"].unique()
no_check = df[~df["subject_id"].isin(p)]
# len(no_check['subject_id'].unique()) = 61
no_check = pd.DataFrame(no_check)
no_check = no_check[["subject_id", "width", "height"]].drop_duplicates()

size = pd.concat([size, no_check]).reset_index(drop=True)
size = size.rename(columns={"width": "screen_width", "height": "screen_height"})
df_total = pd.merge(df_total, size, on="subject_id")

# df_total.to_csv("data/no_demo.csv", index=False)

# ------------------ Insert Participant Demographics (Urban/Rural/Suburban/Others)--------
# data = pd.read_csv("data/clean_demographics_2.csv")
# data = data[["subject_id",
#              "urban_rural_background",
#              "urban_rural_now",
#              "ArtsBg",
#              "ArchBg",
#              "Total_Time_Elapsed"]]

# # Replace 'Unsure' answers with NaN
# data["urban_rural_now"] = data["urban_rural_now"].replace("Unsure", np.nan)

# # Rename columns
# # data = data.rename(columns={"Participant": "subject_id"})
# data = data.rename(columns={"urban_rural_background": "Background_Environment"})
# data = data.rename(columns={"urban_rural_now": "Current_Environment"})
# data = data.rename(columns={"ArtsBg": "Arts"})
# data = data.rename(columns={"ArchBg": "Architecture"})


# ------- ------------------Merge and Format df_total -------------------------------
# Merge data with df_total
df_total = pd.merge(df_total, data, on="subject_id")
# Rename
df_total = df_total.rename(columns={"subject_id": "Participant"})
df_total = df_total.rename(columns={"video": "Video"})
df_total = df_total.rename(columns={"being_away": "Restoration"})
df_total = df_total.rename(columns={"presence": "Presence"})
df_total = df_total.rename(columns={"willingnesstowalk": "WillingnessToWalk"})
df_total = df_total.rename(columns={"chaotic-ordered": "Structure"})
df_total = df_total.rename(columns={"dull-scenic": "Scenic"})
df_total = df_total.rename(columns={"boring-interesting": "Interest"})
df_total = df_total.rename(columns={"ugly-beauty": "Beauty"})
df_total = df_total.rename(columns={"narrow-wide": "Width"})
df_total = df_total.rename(columns={"empty-crowded": "Crowdedness"})
df_total = df_total.rename(columns={"unfamiliarfamiliar": "Familiarity"})
df_total = df_total.rename(columns={"positive-negative": "Valence"})
df_total = df_total.rename(columns={"calm-excited": "Arousal"})
df_total = df_total.rename(columns={"ArchitectureBackground": "Background_Architecture"})
df_total = df_total.rename(columns={"Arts_bacground": "Background_Arts"})
df_total = df_total.rename(columns={"Urban_Rural": "Background_Rural"})
df_total = df_total.rename(columns={"Time_Watching": "Video_Time"})
df_total = df_total.rename(columns={"condition": "Condition"})

# Fix age col
# df_total["Age"].unique()  # check what are the values
df_total["Age"] = df_total["Age"].replace("21 years old", "21")
df_total["Age"] = df_total["Age"].replace("34 years old", "34")
df_total["Age"] = df_total["Age"].replace("31n", "31")
df_total["Age"] = df_total["Age"].astype(float)

# Format Time Spent Watching Videos from ms to seconds
df_total["Video_Time"] = df_total["Video_Time"] / 1000
df_total.to_csv('C:/Users/anshu/Dropbox/Studies/Nice/NICE_Group-Folder/9_analysis/Online Study/data/preprocessed.csv')

# ==============================================================================
# -------------------------Merge Prolific Data------------------------------------
# ==============================================================================
# Read Demographic data from Prolific
prolific = pd.DataFrame()
for f in os.listdir("../../5_data/1_Online_study/Demographic data/"):
    if f.endswith(".csv"):
        raw = pd.read_csv("../../5_data/1_Online_study/Demographic data/" + f)
        raw['filename'] = f
        prolific = pd.concat([prolific, raw], axis=0)

col = ["Participant id",
       "Submission id",
       "Time taken",
       "Started at",
       "Completed at",
       "Sex",
       "Ethnicity",
       "Nationality",
       "Language",
       "Student status",
       "Employment status",
       "Country of birth",
       "Country of residence",
       "filename"]

prolific = prolific[col]

# !!!!!MISSING: prolific data for participant id 61754f2da1da8be8e7b80054 is missing!!!!!!

# Drop ppts that didn't complete
prolific = prolific.dropna(subset="Time taken")

# Drop all rows with expired data
# prolific = prolific[~prolific.isin(['DATA_EXPIRED']).any(axis=1)]

# Format columns
drop_col = ['Time taken', 'Submission id', 'Time taken', 'Completed at']
prolific = prolific.drop(columns="Time taken")
prolific = prolific.rename(columns={"Participant id": "Participant"})

# Check same participant_id
participant_list = list(df_total["Participant"].unique())
prolific = prolific[prolific["Participant"].isin(participant_list)]

# Filter out ppts who did study > 1 using submission id
out = prolific["Participant"].value_counts()
out = prolific[prolific["Participant"].isin(out[out > 1].index)].sort_index()
keep_id = pd.DataFrame()
for p in out["Participant"].unique():
    valid_sub = out[out["Participant"] == p]
    # Manually filter for participant with consent revoked in first session
    if p == "60c048ca962103e0da201a34":
        valid_sub = valid_sub.iloc[1, :].loc["Submission id"]
    else:
        valid_sub = valid_sub.iloc[0, :].loc["Submission id"]
    valid_sub = pd.Series(valid_sub)
    keep_id = pd.concat([keep_id, valid_sub], axis=0)

drop_id = out[~out["Submission id"].isin(keep_id.iloc[:, 0])]
drop_id = drop_id["Submission id"]
prolific = prolific[~prolific["Submission id"].isin(drop_id)]

# Drop duplicated prolific data
prolific = prolific.drop_duplicates()

# Filter out ppts with same submission id but diff demographic information
out2 = prolific["Participant"].value_counts()
out2 = prolific[prolific["Participant"].isin(out2[out2 > 1].index)].sort_index()
keep_ppt = pd.DataFrame()
for p in out2["Participant"].unique():
    keep = out2[out2["Participant"] == p]
    keep_x = keep.iloc[0, :]
    keep_x = pd.DataFrame(keep_x).transpose()
    keep_ppt = pd.concat([keep_ppt, keep_x], axis=0)

prolific = prolific[~prolific['Participant'].isin(keep_ppt['Participant'])]
prolific = pd.concat([prolific, keep_ppt], axis=0)

# Merge demographic data with all data from task
df_all = pd.merge(df_total, prolific, on="Participant")

# demo_data = pd.DataFrame(np.repeat(prolific.values, len(df_total) / len(prolific), axis=0))
# demo_data.columns = prolific.columns
# demo_data = demo_data.sort_values(by="Participant")

# df_total = df_total.sort_values(by="Participant")
# df_all = df_total.merge(demo_data, on="Participant", how="right").drop_duplicates()


# ==============================================================================
# ------------------------ Merge Meta Data from Videos--------------------------
# ==============================================================================
temp = pd.read_csv(os.path.join(base_dir, "3_materials/stimuli_scripts/final_set_with_testing_groups typology.csv"))
temp = temp[["link", "name_df", "primary_category", "secondary_category"]]

# Remove duplicates
# Note filter to get only second set of dupes since first set returns all nans in all categories
keep_vid = temp.dropna(subset="primary_category")

# Rename columns
keep_vid = keep_vid.rename(columns={"link": "Video"})
keep_vid = keep_vid.rename(columns={"name_df": "Video_Name"})

# Merge video data with df_all
df_vid = pd.merge(df_all, keep_vid, on="Video")


# Remove duplicates
# duplicate = temp["link"].value_counts()
# duplicate = list(duplicate[duplicate > 1].index)
# check = temp[temp["link"].isin(duplicate)]

# Note that 2 videos are duplicated in the final_set.csv
#'https://player.vimeo.com/progressive_redirect/playback/688201779/rendition/1080p/file.mp4?loc=external&oauth2_token_id=1594257730&signature=c0d50b5c4aca703a2c5d5501fdc9085655a70f93d3acc3547b5dfd92609bbe62',

# 'https://player.vimeo.com/progressive_redirect/playback/688201846/rendition/1080p/file.mp4?loc=external&oauth2_token_id=1594257730&signature=203c5e8845c7e947f5fbeb0f64bacf5e3cbf5c86862687e4fd43faf9e204ea48'


# ==============================================================================
# ------------------------- Save data as .csv file -----------------------------
# ==============================================================================



df_vid.to_csv(os.path.join(base_dir, "9_analysis/Online Study/data/data_preprocessed.csv"), index=False)
