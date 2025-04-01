# Visual_Interfaces_Project_2
Nathan Suer, Caleb Copley, and Ryan Williams

Link to hosted project: https://nsuer.github.io/Visual_Interfaces_Project_2/

Link to github repository: https://github.com/NSuer/Visual_Interfaces_Project_2

## Motivation
The motivation for this project is to allow the general public to better understand seismic activity in the US. We wanted to show how the number of earthquakes has changed over time, and where they are occuring. We also wanted to show the severity of the earthquakes. We believe that this information is important for the general public to know, so that they can be better prepared for earthquakes. We also believe that this information is important for policy makers to know, so that they can make better decisions on how to prepare for earthquakes.

## Data
The data comes from the US Geological Survey website. We chose to focus on the US, We beleive there is too much data to focus on the whole world. The data is on siesmic activity, which includes earthquakes, explosions, and anything else that causes trembling in the earth. We chose to do from 2000 to 2024. We chose this time frame because we wanted to see how the number of earthquakes has changed over our lifetime. The key data for each earthquake is the time it occured, longitude, latitude, depth, magnitude, desription of place, and type of seismic activity (earthquake, explosion, etc.). We did notice that the data on magnitude was not all in the same units ......

For the preprocessing, the magTypes were scattered and non-uniform so certain points of data needed a reliability check. Most data was considered reliable but a number of changes were made overall. There were two data points, both recorded in California with magTypes that did not line up with the USGS. One was missing the magType. The other had a magType of ma which was undocumented. A number of the magTypes were also consolidated. The magTypes mlg and mblg were both consolidated with mb_lg since they are synonymous. The magType ml(texnet) was consolidated to ml because texnet is actually a data station used to collect the info. Finally, based off of the magnitude values and the prefix "mw", mw was consolidated to mwr because the authoritative range for mww (the standard choice) was out of scope for the ranges mw pointed to.

Original data: https://earthquake.usgs.gov/earthquakes/search/

Preprocessed data: https://drive.google.com/file/d/1MuwynEs8_aVwW4o9q7eF1emQWI7Sdl9G/view?usp=sharing

## Visualization Components


### Map
The main component of our project is the map. The map shows the location of each seismic event. The map is interactive, you can zoom in and out, and you can hover over a circle to see more information about the event. The color of the circle represents the magnitude of the event. We used a sequential color scheme for the magnitude. This means that the lower the magnitude the lighter the color will be and the higher the magnitude the darker the color will be. We did this because we wanted to show the severity of the event and a sequential color scheme for a scale from 0-10 makes it easy for the user to undestand.

Another part of the map is that it animates over time. We have a sliding bar selecting a specific month to view the seismic activity of. We also have start and stop animation buttons and an input to choose the speed of the animation. The input is in milliseconds, and it controls how fast one month goes by, so the lower the number, the faster the animation.

The map does not have a brush to add a filter based on geolocation, however it does respect filters set by other plots.
![Map](images\Map.png)

### Scatter Plot - Visualize number of earthquakes over time
The scatterplots are a secondary component of the application that allows the user to more easily visualize the earthquake statistics without needing to comb through the map over time. The user is capable of hovering over circles that allow them to figure out what that point on the graph means. This is mainly added for an increase in insight and clarity on the users end.

There are three specific plots to consider. One shows the user the magnitude distributions. Another shows them the depth distributions. The final is an overall timeline showing what quakes happened when and the user, armed with the ability to hover, is able to get insights on the earthquake after identifying which they want to learn more about after seeing what point in time it occurred.
![Plots](images\Plots.png)

### Level 3 goals
Level 3 introduces two scatter plots to visualize the quake distribution over magnitude and depth. 

The first plot describes the distribution of quakes by magnitude. Here, the converted magnitude from preprocessing  for each data point is rounded to the nearest tenth. Then, the number of instances of each rounded magnitude are graphed. 

The second plot describes the distribution of quakes by depth. Here, quake depth is rounded to the nearest kilometer, then the number of instances of each rounded depth are graphed.

Notably, neither of these plots display individual quakes. The map and timeline do that already; these are solely for distribution analysis. 

Tooltips are generated to display the exact number of quakes at the magnitude you're hovering. 

### Level 4 goals
Level 4 gives the user granular control over the ranges of time, magnitude, and depth to display earthquakes within. 

The dot plots all have brushing functionality, wherein a user can slide and resize a window over top of the plot. Any data points outside that window are excluded from all other plots, including the map. 

These filters stack additively, meaning an earthquake data point must fit all applied filters to be displayed. Conversely, a data point fitting all filters will be displayed on every visualization.

Of course, if the user wishes to clear their filter choices and return to the full dataset, they can click the "Reset Filters" button to do so. Then they can start brushing again. 

### Level 6 goals
Level 6 seeks to add more meaning to one of the more ambiguous data points: magType. The United States Geographical Service goes into a lot of detail on the calculation, authorization, and implementation of the different magnitude types so I believe that it is an interesting piece of data that can offer people insight as to what that parameter means. As such, I added the MagType to the mouseover effect and implemented a grouping mechanism that highlights all data points of a specific magType when the feature is selected.   

## What the application allows you to discover
The application of our map is focused around education and the disclosure of the relationship between the different magnitude types. Earthquakes are measured via different scales that means different things about an earthquake. These things, however, are typically not very civilian friendly. Our map should allow a user to identify the relationship between earthquakes, the scale used, and the varying factors that helped determine that scale. For example, the screenshot below focuses on the mb_lg scale. One only used in central and eastern america. The graph shows off where it is used and how often. As seen below, the purple marks exclusively appear in the east, showing the user that the scale is a localized scale rather than a universal one.

![Observation](images\LearnScreen.png)

## Process

### Libraries
We included two libraries for this project:
 - D3: Used to create the plots and their interactive components, like brushes.
 - Leaflet: Used to create the interactive map of the USA. 

### Code Structure
Each graph type has its own class, which has its own file. 
 - wavePlot.js: Base class for the magnitude and depth distribution charts. 
 - timeWavePlot.js: Base class for the timeline chart. Similar to wavePlot.js, but simpler and with time on the X axis. 
 - leafletMap.js: Base class for the USA map. 
 - main.js: Instantiates the above visualizations. Additionally, performs minor data post-processing, and handles filter application and removal.

### How to access and run
To access and run the code, you can go to the github repository and download the code. You can then run the code by opening the index.html file in a web browser. You can also access the code by going to the hosted project link.

### Code Link

https://github.com/NSuer/Visual_Interfaces_Project_2

### Live Application Link

https://nsuer.github.io/Visual_Interfaces_Project_2/

## AI and Collaboration
Some of us use github copilot when we program. This is used more as an autocomplete tool rather than asking it to write code for us.

## Demo Video
https://youtu.be/QYEi9XjDjh8
This is also on our personal webpages.
