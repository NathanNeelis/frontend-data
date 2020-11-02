### functional-programming
functional-programming 20/21  
Student name: Nathan Neelis  
live website: https://nathanneelis.github.io/functional-programming/

### Assignment
For the Volkskrant we are taking a look at the RDW datasets to find interesting insights for a potential article about the car in the city. The subject is "the car in the city" and the datasets contains all kind of information about parking. But we're free to explore other data as well that has to do with the car in the city.  

### Research questions
**Main research question: At which train stations are you able to park your car?**   
**Sub question 1:** Can you also recharge your parked car?   
**Sub question 2:** Are you able to park your car if you are disabled?  
**Sub question 3:** Where can you grab a OV-fiets after you parked your car?   
**(Optional) Sub question 4:** Which P+R is the best parking spot for visiting Amsterdam Central station?  
  
Please read my [wiki](https://github.com/NathanNeelis/functional-programming/wiki/concept) for more information about my assumptions and datasets.

### Concept
I want to create a bar chart for the 9 Randstad cities. That shows the difference in paid and free P+R parking area's. And maybe, if the data is there a difference in rates. I would also like to pick out some cities outside the randstad and show the difference in paid and free P+R.
  
After that I would like so like to visualize a geographical map of all P+R parking places. I want to show a difference in paid and free. And I also want to highlight the best P+R spot to visit Amsterdam and maybe other cities.   

<img width="786" alt="Schermafbeelding 2020-10-30 om 10 39 43" src="https://user-images.githubusercontent.com/55492381/97689670-3cab1f00-1a9c-11eb-959a-346a6e9398c9.png">

### Datasets
[RDW dataset: GEO Parkeerkarages](https://opendata.rdw.nl/Parkeren/GEO-Parkeer-Garages/t5pc-eb34)  
_Variables: Geolocations and areaid codes_  
[RDW dataset: Geometrie gebied](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-GEOMETRIE-GEBIED/nsk3-v9n7)  
_Variables: areaid, GeoDataAsText_  
[RDW dataset: Specificaties parkeergebieden](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-SPECIFICATIES-PARKEERGEBIED/b3us-f26s)  
_Variables:  Areaid's, total parking spots, electric charge parking spots, disabled parking spots._  
[NS dataset: train station location](https://apiportal.ns.nl/)  
[NS dataset: P+R free parking areas](https://apiportal.ns.nl/)  
[NS dataset: P+R paid parking areas](https://apiportal.ns.nl/)  
_Variables: Location (long/lat) for train stations and P+R parking areas, rate paid P+R_  

### Getting started
_For a part of this project I used a dataset from a survey which is sensitive and cannot be shared online._
_By downloading this project you will miss the key ingredient for the survey_Data_script.js_  
  
But this is only the start of this project, please feel free to skip that part for now and take a look at the way more interesting javascript files where I start cleaning data from API's and transform it for D3 visualisation.  

#### Cloning the repo
1. Create your git repo  
    ```mkdir foldername```   
    ```cd "/foldername"```    
    ```git init```  

2. Clone this repo  
    ```git clone https://github.com/NathanNeelis/functional-programming.git```   

#### Download as zip
1. Go to the url below and it will download the zip automatically  
    ```http://github.com/NathanNeelis/functional-programming/archive/master.zip``` 

### License
[MIT License](https://github.com/NathanNeelis/functional-programming/blob/master/LICENSE)   

### Resources
**Survey Data**  
From all students following the datavisualisation track.   

**Data sets**   
[RDW open data](https://opendata.rdw.nl)  
[NS API](https://apiportal.ns.nl/)  

**Code resources**  
[String to numbers](https://stackoverflow.com/questions/15677869/how-to-convert-a-string-of-numbers-to-an-array-of-numbers) Stackoverflow    
[Using replace method 1](https://stackoverflow.com/questions/953311/replace-string-in-javascript-array) Stackoverflow  
[Using replace method 2](https://stackoverflow.com/questions/7990879/how-to-combine-str-replace-expressions-in-javascript) Stackoverflow  
[Using replace method 3](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)Developer mozilla  
[Using hex color codes](https://htmlcolorcodes.com/color-names/) Html color codes  
[Using charAt](https://github.com/marcoFijan/functional-programming/blob/12ac7c24a5239bbb07b15b4d18ad67857d87895d/EnqueteData/index.js#L64-L69) Student Marco Fijan  
[Using fetch headers](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) developer mozilla  
[Learning NS API](https://github.com/aaraar/web-app-from-scratch-1920/blob/188a235e690a3e0963b1eac0907f89bcbd2827a8/src/Api.ts#L61-L81) Bas Aaraar 19/20   

**API resources**  
[Learning NS API](https://apiportal.ns.nl/startersguide?_ga=2.32115260.384544656.1604054320-687691016.1603727685) NS startersguide  
[TomTom API doc](https://developer.tomtom.com/on-street-parking) TomTom  
[RDW API doc](https://www.rdw.nl/over-rdw/dienstverlening/open-data/handleidingen) RDW  
