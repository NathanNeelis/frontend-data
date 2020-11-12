### functional-programming & Frontend Data
functional-programming - Frontend Data 20/21  
Student name: Nathan Neelis  
:earth_americas: [live website](https://nathanneelis.github.io/frontend-data/index.html)

![eindresultaat3](https://user-images.githubusercontent.com/55492381/98954775-70576180-24fe-11eb-842d-d29f06e66d6a.gif)

### Assignment
For the Volkskrant we are taking a look at the RDW datasets to find interesting insights for a potential article about the car in the city. The subject is "the car in the city" and the datasets contains all kind of information about parking. But we're free to explore other data as well that has to do with the car in the city.  

### Research questions
**Main research question: Which city uses the Park and Ride parking areas the best to keep cars from their city center?**   
**Sub question 1:** Are all Randstad cities providing P+R parking areas?  
**Sub question 2:** What about cities outside of the Randstad?  
**Sub question 3:** Is there a difference in rate for the Randstad cites and outside?  
**Sub question 4:** How long does it take to reach your destination from the P+R?
  
Please read my [wiki](https://github.com/NathanNeelis/frontend-data/wiki/concept) for more information about my assumptions and datasets.

### Concept
A radar chart that shows the amount of P+R parking areas for the 9 Randstad cities. 
Going in-depth you would be able to see how many P+R parking spaces each city in total has available.  
The second part of the concept is to split these results and filter on paid, free, or both (total).  
The third part of the concept would be to map the differences in rate for the paid P+R parking areas.
To finish it would be nice to show how long it would take from a P+R to reach a destination, for example, the train station.  

![PR_RadarChart-digitaal](https://user-images.githubusercontent.com/55492381/98220139-2b578c00-1f4e-11eb-8a87-c259ca875acc.jpg)  


### Datasets
[NPR open dataset: parking data v2](https://npropendata.rdw.nl/parkingdata/v2/)  
This dataset is a pack of URL's to specific datasets about each parking area.  
I filtered this dataset on all parking areas that had "P+R" in their name.  
These were 405 results from which I fetched the data and saved it into a [Github Gist](https://gist.githubusercontent.com/NathanNeelis/b28e16c0433b12da6bc716b276901ae9/raw/402754fa45924af802d06c5672043153bb990d5b/NPR_park_and_ride).  
The interesting variables in these specific datasets are:  
* Description - _Name of the parking area_    
* Accespoint address city - _city of the parking area_  
* Operator name - _Also name of the city, in case the accespoint data is invalid_  
* Specifications capacity - _Amount of parking spaces_  


### Three steps of learning to visualize in this project
This project is divided into three parts.  
  
#### First part - learning to clean the data
To start I got tasked to clean the data from the dataset I got from a survey. Since this dataset contains sensitive data from other students following this course we decided it should not be shared online. But this part was only a learning step to start cleaning data from real datasets. So please feel free to look at the functional programming used to clean this survey data, but keep in mind, the data itself is missing and therefore [this javascript file](https://github.com/NathanNeelis/frontend-data/blob/master/js/surveyData_script.js) cannot be used in the browser.
  
#### Second part - cleaning and transforming  
In the begin, I had to explore the [RDW parking data](https://opendata.rdw.nl/browse?category=Parkeren) for interesting insights I might want to explore for my assignment from the Volkskrant. Here I found my concept as written above. For this concept, I explored multiple datasets from the RDW, but also from the NS and at the end the NPR open data set, which contained all the information I needed to start.
After [fetching all P+R parking areas](https://github.com/NathanNeelis/frontend-data/blob/master/fetch_NPR.js) I cleaned the data and finally transformed it so I could start creating my visual.

#### Third part - visualizing and getting ready to present
With my transformed data I could start making my visual with the [D3 Library](https://github.com/d3/d3).  

### Getting started

#### Cloning the repo
1. Create your git repo  
    ```bash
    mkdir foldername  
    cd "/foldername"  
    git init  
    ```  

2. Clone this repo  
    ```bash
    git clone https://github.com/NathanNeelis/frontend-data.git
    ```   

3. install packages  
    ```bash
    npm install
    ```  

4. optional: fetch the data  
    ```bash
    node fetch_NPR.js
    ```  

#### Download as zip
1. Go to the URL below and it will download the zip automatically  
    ```https://github.com/NathanNeelis/frontend-data/archive/master.zip```

### License
[MIT License](https://github.com/NathanNeelis/frontend-data/blob/master/LICENSE)   

### Resources
**Examples for creating my bar chart**  
* [Currans tutorial](https://vizhub.com/curran/a44b38541b6e47a4afdd2dfe67a302c5)  
* [Laurens live coding example](https://vizhub.com/Razpudding/c2a9c9b4fde84816931c404951c79873)  
<img width="500" alt="BC_example_barchart_Curran" src="https://user-images.githubusercontent.com/55492381/98918264-b0522080-24cd-11eb-823c-ae7407e691bd.png"> <img width="500" alt="Schermafbeelding 2020-11-12 om 13 33 30" src="https://user-images.githubusercontent.com/55492381/98940695-a93a0b00-24eb-11eb-9f87-f7439f6b6b61.png">
  
**Survey Data**  
From all students following the data visualization track.   

**Data sets**   
[RDW open data](https://opendata.rdw.nl)  
[NS API](https://apiportal.ns.nl/)  
[NPR open data](https://npropendata.rdw.nl/parkingdata/v2/)  

**Code resources**  
[String to numbers](https://stackoverflow.com/questions/15677869/how-to-convert-a-string-of-numbers-to-an-array-of-numbers) Stackoverflow    
[Using replace method 1](https://stackoverflow.com/questions/953311/replace-string-in-javascript-array) Stackoverflow  
[Using replace method 2](https://stackoverflow.com/questions/7990879/how-to-combine-str-replace-expressions-in-javascript) Stackoverflow  
[Using replace method 3](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)Developer mozilla  
[Using hex color codes](https://htmlcolorcodes.com/color-names/) Html color codes  
[Using charAt](https://github.com/marcoFijan/functional-programming/blob/12ac7c24a5239bbb07b15b4d18ad67857d87895d/EnqueteData/index.js#L64-L69) Student Marco Fijan  
[Using fetch headers](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) developer mozilla  
[Learning NS API](https://github.com/aaraar/web-app-from-scratch-1920/blob/188a235e690a3e0963b1eac0907f89bcbd2827a8/src/Api.ts#L61-L81) Bas Aaraar 19/20   
[D3 update](https://vizhub.com/Razpudding/c2a9c9b4fde84816931c404951c79873) Laurens Aarnoudse  
[Checkbox Styling](https://github.com/Godsont/Custom-Checkbox) Godsont  
[Merge duplicates in array of objects](https://stackoverflow.com/questions/38294781/how-to-merge-duplicates-in-an-array-of-objects-and-sum-a-specific-property) Nina Scholz  
[Merge duplicates in array of objects](https://stackoverflow.com/questions/60036060/combine-object-array-if-same-key-value-in-javascript) Kobe  
[Changing not existing values](https://stackoverflow.com/questions/47870887/how-to-fill-in-missing-keys-in-an-array-of-objects) user184994  
[Creating objects from different arrays](https://stackoverflow.com/questions/40539591/how-to-create-an-array-of-objects-from-multiple-arrays) Zack Tanner  
[Remove duplicates](https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript) Eydrian  
[Transitions from bottom to top](https://stackoverflow.com/questions/36126004/height-transitions-go-from-top-down-rather-than-from-bottom-up-in-d3) Harry Vane  
[CORS PLUGIN](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf) Victor Boucher  
[Remove object from array](https://stackoverflow.com/questions/51367551/how-to-remove-object-from-array-if-property-in-object-do-not-exist) mickl  
[Promise all](https://vizhub.com/Razpudding/781fc8abc97443919613184546720ab0?edit=files&file=index.js) Laurens  
[FS writing json file](https://dlo.mijnhva.nl/d2l/ext/rp/192600/lti/framedlaunch/a44d697c-b552-4a8c-b5e7-12fe6b8d704a) Rijk  
[FS writing json file](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback) NodeJS.org  
[selecting checkbox in D3](https://bl.ocks.org/johnnygizmo/3d593d3bf631e102a2dbee64f62d9de4) Johnny Matthews


**API resources**  
[Learning NS API](https://apiportal.ns.nl/startersguide?_ga=2.32115260.384544656.1604054320-687691016.1603727685) NS startersguide  
[TomTom API doc](https://developer.tomtom.com/on-street-parking) TomTom  
[RDW API doc](https://www.rdw.nl/over-rdw/dienstverlening/open-data/handleidingen) RDW  
[NPR open data](https://npropendata.rdw.nl/parkingdata/v2/) NPR  
