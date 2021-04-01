import pandas as pd
import json 
import numpy as np
from functools import reduce
from itertools import combinations

# load data
netflix_data = pd.read_csv("../data/netflix.csv")

"""
GRAPH 1 PRE-PROCESSING
"""

# # for all data
# genre_data = list(map(lambda x: x.split(', ') if not isinstance(x, float) else [], netflix_data['listed_in']))
# genre_data = list(reduce(lambda a, b: a + b, genre_data))
# genre_data = pd.DataFrame(genre_data, columns=['genre'])
# genre_data['count'] = np.ones(len(genre_data['genre']))

# genre_data_grouped = genre_data.groupby(['genre']).sum()
# genre_data = pd.DataFrame(genre_data_grouped.index.values, columns=['genre'])
# genre_data['count'] = list(genre_data_grouped['count'])

# # change TV show number
# tv_show_data = netflix_data[netflix_data['type'] == 'TV Show']
# number_of_tv_shows = len(tv_show_data.index)
# genre_data.loc[genre_data['genre'] == 'TV Shows', 'count'] = number_of_tv_shows 
# genre_data = genre_data.sort_values(by=['count'],  ascending=False)

# # change Movies number
# movie_data = netflix_data[netflix_data['type'] == 'Movie']
# number_of_movies = len(movie_data.index)
# genre_data.loc[genre_data['genre'] == 'Movies', 'count'] = number_of_movies 
# genre_data = genre_data.sort_values(by=['count'],  ascending=False)

# genre_data.to_csv("genre_data_all.csv", index=False)

# # for just Movies
# genre_data_movies = netflix_data[netflix_data['type'] == 'Movie']
# genre_data_movies = list(map(lambda x: x.split(', ') if not isinstance(x, float) else [], genre_data_movies['listed_in']))
# genre_data_movies = list(reduce(lambda a, b: a + b, genre_data_movies))
# genre_data_movies = pd.DataFrame(genre_data_movies, columns=['genre'])
# genre_data_movies['count'] = np.ones(len(genre_data_movies['genre']))

# genre_data_movies_grouped = genre_data_movies.groupby(['genre']).sum()
# genre_data_movies = pd.DataFrame(genre_data_movies_grouped.index.values, columns=['genre'])
# genre_data_movies['count'] = list(genre_data_movies_grouped['count'])
# genre_data_movies = genre_data_movies.sort_values(by=['count'],  ascending=False)

# genre_data_movies.to_csv("genre_data_movies.csv", index=False)

# # for just TV Shows
# genre_data_shows = netflix_data[netflix_data['type'] == 'TV Show']
# genre_data_shows = list(map(lambda x: x.split(', ') if not isinstance(x, float) else [], genre_data_shows['listed_in']))
# genre_data_shows = list(reduce(lambda a, b: a + b, genre_data_shows))
# genre_data_shows = pd.DataFrame(genre_data_shows, columns=['genre'])
# genre_data_shows['count'] = np.ones(len(genre_data_shows['genre']))

# genre_data_shows_grouped = genre_data_shows.groupby(['genre']).sum()
# genre_data_shows = pd.DataFrame(genre_data_shows_grouped.index.values, columns=['genre'])
# genre_data_shows['count'] = list(genre_data_shows_grouped['count'])
# genre_data_shows = genre_data_shows.sort_values(by=['count'],  ascending=False)

# genre_data_shows.to_csv("genre_data_shows.csv", index=False)


"""
GRAPH 2 PRE-PROCESSING
"""

# get relevant data
# graph2_data = netflix_data[netflix_data['type'] == 'Movie']
# release_year_data = graph2_data['release_year']
# runtime_data = graph2_data['duration']
# runtime_data = list(map(lambda x: int(x.split(' ')[0]), runtime_data))
# # print(runtime_data)
# graph2_data = pd.DataFrame(release_year_data, columns=['release_year'])
# graph2_data['duration'] = runtime_data

# # get avg runtimes
# graph2_data_grouped = graph2_data.groupby(['release_year']).mean()
# # print(list(genre_data_grouped['count']))
# # print(genre_data_grouped.index.values)
# graph2_data = pd.DataFrame(graph2_data_grouped.index.values, columns=['release_year'])
# graph2_data['average_runtime'] = list(graph2_data_grouped['duration'])
# graph2_data = graph2_data[graph2_data['average_runtime'] < 200]
# graph2_data.to_csv("runtime_data.csv", index=False)

# """
# GRAPH 3 PRE-PROCESSING
# """

years = np.arange(2000, 2021)

def get_data(years):
    for year in years:
        graph3_data = netflix_data[netflix_data['type'] == 'Movie']
        graph3_data = graph3_data[graph3_data['release_year'] == year]

        # make nodes dataframe
        actors = [] 
        actors = map(lambda x: sorted(x.split(', '))\
            if not isinstance(x, float) else [], graph3_data['cast']) # make sure links are directed in one way only, so no actor1->actor2 actor2->actor1
        actors = reduce(lambda a, b: a + b, actors)
        nodes_data = pd.DataFrame(actors, columns=['name'])
        id_col = np.arange(len(nodes_data['name']))
        nodes_data['id'] = id_col

        # find actors that have made the most movies
        top_actors_data = pd.DataFrame(actors, columns=['id'])
        top_actors_data = pd.DataFrame(list(map(lambda x: nodes_data.loc[nodes_data['name'] == x, 'id'].iloc[0], top_actors_data['id'].values)), columns=['id'])
        count = np.ones(len(nodes_data.index))
        top_actors_data['count'] = count
        top_actors_data_grouped = top_actors_data.groupby(['id']).sum()
        top_actors_data = pd.DataFrame(list(top_actors_data_grouped.index.values), columns=['id'])
        top_actors_data['count'] = list(top_actors_data_grouped['count'])
        num_actors = float('inf')
        movies = 0
        while (num_actors > 100):
            top_actors_data = top_actors_data[top_actors_data['count'] > movies]
            movies += 1
            num_actors = len(top_actors_data.index)
            print("top actors > " + str(movies) + "movies", num_actors)
            print(top_actors_data)
        if num_actors == 0:
            top_actors_data = top_actors_data[top_actors_data['count'] > (movies - 1)]

        # drop duplicates from nodes
        nodes_data = nodes_data.drop_duplicates(subset=['name'])

        casts = np.array(list(map(lambda x: x.split(', ') if not isinstance(x, float) else [], graph3_data['cast'])))

        links_data = map(lambda x: list(combinations(x, 2)), list(casts))
        links_data = list(reduce(lambda a, b: a + b, list(links_data)))
        links_data = pd.DataFrame(links_data, columns=['source', 'target'])
        links_data = list(map(lambda x: [nodes_data.loc[nodes_data['name'] == x[0], 'id'].iloc[0], \
            nodes_data.loc[nodes_data['name'] == x[1], 'id'].iloc[0]], links_data.values))
        # links_data = list(map(lambda x: tryconvert(x), links_data.values))
        links_data = pd.DataFrame(links_data, columns=['source', 'target'])
        links_data = links_data.drop_duplicates(subset=['source', 'target']) 

        # filter top actors
        nodes_data = nodes_data[nodes_data['id'].isin(top_actors_data['id'])]
        links_data = links_data[links_data['source'].isin(nodes_data['id'])]
        links_data = links_data[links_data['target'].isin(nodes_data['id'])]

        # turn nodes to json 
        nodes_data_json = nodes_data.to_json(orient="records")
        nodes_data_json = json.loads(nodes_data_json)

        # turn links to json 
        links_data_json = links_data.to_json(orient="records")
        links_data_json = json.loads(links_data_json)
        all_movies_network_data = {'nodes': nodes_data_json, 'links': links_data_json}
        with open('all_movies_network_data_' + str(year) + '.json', 'w') as outfile:
            json.dump(all_movies_network_data, outfile)

# get_data(years)
