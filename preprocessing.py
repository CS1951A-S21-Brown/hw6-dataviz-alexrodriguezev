import pandas as pd
import json 
import numpy as np
from functools import reduce
from itertools import combinations


netflix_data = pd.read_csv("data/netflix.csv")

# make nodes dataframe
actors = [] 
actors = map(lambda x: x.split(', ') if not isinstance(x, float) else [], netflix_data['cast'])
actors = reduce(lambda a, b: a + b, actors)
nodes_data = pd.DataFrame(actors, columns=['name'])
nodes_data = nodes_data.drop_duplicates(subset=['name'])
id_col = np.arange(len(nodes_data['name']))
nodes_data['id'] = id_col
# print(nodes_data)

# turn nodes to json 
nodes_data_json = nodes_data.to_json(orient="records")
parsed = json.loads(nodes_data_json)
nodes_data_json = json.dumps(parsed)
nodes_data_json = {'nodes' : nodes_data_json}

# make links dictionary

def tryconvert(x):
    try:
        return nodes_data.loc[nodes_data['name'] == x, 'id'].iloc[0]
    except:
        print(x)
        print(nodes_data[x])
        print(nodes_data.loc[nodes_data['name'] == x, 'id'].iloc[0])
    return "default"

links_data = []

casts = np.array(list(map(lambda x: x.split(', ') if not isinstance(x, float) else [], netflix_data['cast'])))
# new_df = pd.DataFrame(actors, columns=['cast'])
# new_df = new_df.applymap(lambda x: nodes_data.loc[nodes_data['name'] == x, 'id'].iloc[0])
# print(new_df)

# pairs = []

links_data = map(lambda x: list(combinations(x, 2)), list(casts))
# print(list(links_data))
links_data = list(reduce(lambda a, b: a + b, list(links_data)))
# links_data = pd.DataFrame(links_data, columns=['source', 'target'])
print(links_data)
links_data = list(map(lambda x: [nodes_data.loc[nodes_data['name'] == x[0], 'id'].iloc[0], \
    nodes_data.loc[nodes_data['name'] == x[1], 'id'].iloc[0]], links_data.values))

links_data = pd.DataFrame(links_data, columns=['source', 'target'])

# links_data = links_data.reshape(-1, links_data.shape[-1])

print(links_data)

# for actors in casts:
#     pairs.append(combinations(actors))
# links_data = np.array(links_data).flatten()
# links_data = pd.DataFrame(links_data, columns=['source', 'target']) 
# # cast_data = map(lambda x: nodes_data.loc[nodes_data['name'] == x, 'id'].iloc[0], cast_data)
# actors = np.apply_along_axis(map(lambda x: nodes_data.loc[nodes_data['name'] == x, 'id'].iloc[0], actors), 0, actors)
# # print("cast data", actors)
# for cast in netflix_data['cast']:
#     actors = cast.split(', ') if not isinstance(cast, float) else []
#     for i in range(len(actors)):
#         for j in range(i + 1, len(actors)):
#             actor1 = actors[i]
#             actor2 = actors[j]
#             id1 = nodes_data.loc[nodes_data['name'] == actor1, 'id'].iloc[0]
#             id2 = nodes_data.loc[nodes_data['name'] == actor2, 'id'].iloc[0]
#             links_data.append([id1, id2])
# links_data = pd.DataFrame(links_data, columns=['source', 'target'])
# links_data = links_data.drop_duplicates(subset=['source', 'target']) 
# print(links_data)

# # turn nodes to json 
# links_data_json = links_data.to_json(orient="records")
# parsed = json.loads(links_data_json)
# links_data_json = json.dumps(parsed)
# links_data_json = {'nodes' : links_data_json}
# print(links_data_json)

# for cast in netflix_data['cast']:
#     cast_names = cast.split(', ')
#     actors.append(cast_names)

# p = ["A, B, C", "D, A, F"]
# t = pd.DataFrame(p, columns=['cast'])

# list_names = []
# for names in t['cast']:
#     listnames = names.split(', ')
#     list_names.append(listnames)
# list_names = np.array(list_names).flatten()
# print(list_names)
# x = pd.DataFrame(list_names, columns=['names'])
# x = x.drop_duplicates(subset=['names']) 
# idcol = np.arange(len(x['names']))
# x['id'] = idcol
# print(x)


# data = []
# for names in p:
#     listnames = names.split(', ')
#     for i in range(len(listnames)):
#         for j in range(i + 1, len(listnames)):
#             name1 = listnames[i]
#             name2 = listnames[j]
#             id1 = x.loc[x['names'] == name1, 'id'].iloc[0]
#             id2 = x.loc[x['names'] == name2, 'id'].iloc[0]
#             # print("id1", id1)
#             # print(id2)
#             data.append([id1, id2])
# data.append(['1', '2'])
# print(data)
# y = pd.DataFrame(data, columns=['source', 'target'])
# y = y.drop_duplicates(subset=['source', 'target']) 

# print(y)

# # print(t)
# # d = [["Name1", 1], ["Name2", 2]]
# # k = pd.DataFrame(d, columns=['name', 'id'])
# # print(k)

# # result = k.to_json(orient="records")
# # parsed = json.loads(result)
# # result = json.dumps(parsed)
# # print(result)
# # x = {'nodes' : result}
# # print(x)
# # data = netflix_data[netflix_data['type'] == 'Movie']
# # data = netflix_data[netflix_data['release_year'] == 2018]

# # count = 0
# # actors = set()

# # for cast_names in data['cast']:
# #     # print("cast names", cast_names)
# #     if not isinstance(cast_names, float):
# #         for name in cast_names.split(","):
# #             if name not in actors:
# #                 actors.add(name)
# #                 count += 1
    
# # # print(count)