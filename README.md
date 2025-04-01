# Visual_Interfaces_Project_1
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
TODO - Add screenshots of each component
<!-- Explain each view of the data, the GUI, etc.  Explain how you can interact with your application, and how the views update in response to these interactions.  -->

### Map
TODO Ryan TODO Caleb  - double check this and add details from level 4 goals

The main component of our project is the map. The map shows the location of each seismic event. The map is interactive, you can zoom in and out, and you can hover over a circle to see more information about the event. The color of the circle represents the magnitude of the event. We used a sequential color scheme for the magnitude. This means that the lower the magnitude the lighter the color will be and the higher the magnitude the darker the color will be. We did this because we wanted to show the severity of the event and a sequential color scheme for a scale from 0-10 makes it easy for the use to undestand.

Another part of the map is that it aniomates over time. We have a sliding bar, to allow the user to select a apecific month to view the seismic activity of. We also have start and stop animation buttons and an input to choose the speed of the animation. The input is in milliseconds, and it controls how fast one month goes by, so the lower the number the faster the animation.

TODO Ryan TODO Caleb TODO Nate - add screenshot of map
![image](Map.png)

### Scatter Plot - Visualize number of earthquakes over time

### Level 3 goals
TODO Ryan

### Level 4 goals
TODO Ryan TODO Caleb

## Level 6 goals
Level 6 seeks to add more meaning to one of the more ambiguous data points: magType. The United States Geographical Service goes into a lot of detail on the calculation, authorization, and implementation of the different magnitude types so I believe that it is an interesting piece of data that can offer people insight as to what that parameter means. As such, I added the MagType to the mouseover effect and implemented a grouping mechanism that highlights all data points of a specific magType when the feature is selected.   

## What the application allows you to discover
TODO Anyone - add a few sentences about what the application allows you to discover and a screenshot of it

![image](Observation.png)

## Process

### Libraries
I only used D3 on the project
TODO Anyone - add any other libraries used


### Code Structure
TODO Ryan TODO Caleb - add a few sentences about the code structure. Also I beleive you guys will use the same thiong I used in project 1, so I just have my description form that project below, Double check that it is still accurate.

My code is structured in a fairly normal way, with each graph being it's own file. The only things of note are my use of a variable called "window.selected" which is a variable that is stored in the window so that all of the graphs can access it. This variable is an array of the seismic occurneces that are selected by the brush. I have an event listener that is triggered whenever I change the selected counties. This event listener then updates the other graphs to show the selected counties. 

### How to access and run
To access and run the code, you can go to the github repository and download the code. You can then run the code by opening the index.html file in a web browser. You can also access the code by going to the hosted project link.

### Code Link

https://github.com/NSuer/Visual_Interfaces_Project_2

### Live Application Link

https://nsuer.github.io/Visual_Interfaces_Project_2/

## AI and Collaboration
- Some of us use github copilot when we program. This is used more as an autocomplete tool rather than asking it to write code for us.
- TODO Ryan TODO Caleb - Add any other AI tools used

## Demo Video
TODO Ryan TODO Caleb TODO Nate - Add a demo video, probabvly upload to youtube and then link here