import statistics as st
import json
import os 


absolute_dirpath = os.path.dirname(__file__)
participants_num = 14


def main():
    cluster_path = os.path.join(absolute_dirpath, './clusters/')
    # read clustering files
    for cluster_file in os.listdir('./clusters'):
        file_path = os.path.join(cluster_path, cluster_file)
        f = open(file_path, 'r')
        cluster_data = json.load(f)
        f.close()
        # one call for selection gestures update
        update_data, total_participants = evaluation('selection', cluster_data)
        ar_selection = calAgreement(total_participants)
        updateFile(cluster_data, update_data, 'selection', file_path, ar_selection)
        # another call for operation gestures to update
        update_data, total_participants = evaluation('gestures', cluster_data)
        ar_operation = calAgreement(total_participants)
        updateFile(cluster_data, update_data, 'gestures', file_path, ar_operation) 

def evaluation(option, cluster_data):
    selection = cluster_data[option]
    orig_operation = cluster_data['operation']
    gestures_path = os.path.join(absolute_dirpath, './gestures/')
    updated_selection = []
    total_participants = []
    # for each cluster in this particular cluster file
    for select in selection:
        participants = select['participants']
        total_participants.append(participants)
        match = []
        easiness = []
        replacement = []
        # for all participants that came up with this cluster
        for participant in participants:
            gesture_file_path = os.path.join(gestures_path, 'p'+ str(participant)+'.json')
            f = open(gesture_file_path, 'r')
            part_data = json.load(f)
            f.close()
            proposals = part_data['proposals']
            # check this participant proposal until we reach the target operation
            for prop in proposals:
                part_operation = prop['operation']
                if orig_operation == part_operation:
                    evaluation = prop['Evaluation']
                    # add the evaluation of this participant
                    match.append(evaluation[0])
                    easiness.append(evaluation[1])
                    replacement.append(evaluation[2])
        # calculate avg and sd for each evaluation array
        match_avg = calAVG(match)
        match_sd = calSD(match)
        easiness_avg = calAVG(easiness)
        easiness_sd = calSD(easiness)
        replacement_avg = calAVG(replacement)
        replacement_sd = calSD(replacement)
        # update this particular part of the json file
        avg = [match_avg, easiness_avg, replacement_avg]
        sd = [match_sd, easiness_sd, replacement_sd]
        select['avg'] = avg
        select['sd'] = sd
        select['match_arr'] = match
        select['easiness_arr'] = easiness
        select['replacement_arr'] = replacement
        updated_selection.append(select)
    return updated_selection, total_participants


def updateFile(orig_data, updated_section, option, file_path, ar_value):
    print("updated: " + option + " in " + file_path)
    ar = 'ar_' + option
    orig_data[ar] = ar_value
    orig_data[option] = updated_section
    # update the current file
    f = open(file_path, 'w')
    json.dump(orig_data, f)
    f.close()

def calSD(arr):
    try:
        return ("{:.2f}".format(st.stdev(arr)))
    except Exception:
        return 0.00

def calAVG(arr):
    return ("{:.2f}".format(st.mean(arr)))

def calAgreement(arrs):
    numerator = 0
    for arr in arrs:
        arr_length = len(arr)
        numerator += (arr_length * (arr_length - 1)) / 2
    denominator = (participants_num * (participants_num - 1)) / 2
    result = numerator / denominator
    return ("{:.2f}".format(result))

if __name__ == "__main__":
    main()
    