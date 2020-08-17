import statistics as st
import json
import os 


absolute_dirpath = os.path.dirname(__file__)
participants_num = 14


def main():
    cluster_path = os.path.join(absolute_dirpath, './clusters/')
    coagreement_path = os.path.join(absolute_dirpath, './coagreement/')
    co_operation = os.path.join(coagreement_path, 'operation.json')
    co_selection = os.path.join(coagreement_path, 'selection.json')
    co_selection_data = {}
    co_operation_data = {}
    # read clustering files
    for cluster_file in os.listdir('./clusters'):
        file_path = os.path.join(cluster_path, cluster_file)
        f = open(file_path, 'r')
        cluster_data = json.load(f)
        f.close()
        orig_operation = cluster_data['operation']
        # one call for selection gestures update
        co_selection_data[orig_operation] = calCoagreement('selection', cluster_data)
        co_operation_data[orig_operation] = calCoagreement('gestures', cluster_data)
    # update coagreement files 
    updateFile(co_selection_data, co_selection)
    updateFile(co_operation_data, co_operation)

def calCoagreement(option, cluster_data):
    selection = cluster_data[option]
    total_pairs = []
    # for each cluster in this particular cluster file
    for i in range(1,14):
        # get the group of this participant
        participantGroup = []
        for innerSelect in selection:
            if i in innerSelect['participants']:
                participantGroup = innerSelect['participants']
                # print(participantGroup)
        # create pairs 
        j = i + 1
        for j in range (j, 15):
            for select in selection:
                participants = select['participants']
                for participant in participants:
                    if (participant in participantGroup) and (i != participant) and ( j == participant):
                        total_pairs.append([i,j])
    return total_pairs


def updateFile(data, file):
    print("updated: " + file)
    # update the current file
    f = open(file, 'w')
    json.dump(data, f)
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
    