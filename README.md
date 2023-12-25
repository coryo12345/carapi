# Car API
API that serves info about various car models.

Try it out: https://carapi.fly.dev/api/random.

## Data
Data is acquired by scraping [Wikipedia](https://www.wikipedia.org/) articles for car models.

Currently, there is data for the following car makes:
* Audi
* BMW
* Chevrolet
* Dodge
* Ford
* Honda
* Mercedes-Benz
* Nissan
* Toyota
* Volkswagen

## Technical Details
The data is hosted on [Turso](https://turso.tech/) - a libsql database provider.  

The scraping script must be run locally to fetch data and make updates to the db, it is not run automatically.  

The api is hosted on [fly.io](https://fly.io/), and is written in go, using the fiber web framework.  

## TODO
* build UI 
    * with api docs
    * with UI example to browse cars

## Opportunities for improvement
* create / find mappings for body styles and regions. 
    * Example - identify body style "car" and "Cars" as the same type. Also, "sedan", "4door", etc... should be in the same group. 
    * Same with region, example: "US", "USA", "America", "United States", should all get converted to the same region. 
* Improve merging logic when scraping. If there are multiple entries for the same primary key, merge the records in memory (before inserting into DB). Keep multiple descriptions, images, etc.. for each row.
