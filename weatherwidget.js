class WeatherWidget {
	
	constructor() {
		this.apiKey = "d82ce8a1358792b59a5ccab77b29da42";
	}
	
	getWeather() {
        let cityId = "625144",
			apiUrl = "https://api.openweathermap.org/data/2.5/",
            apiKey = this.apiKey,
            apiQuery = apiUrl+"/weather?id=" + cityId + "&units=metric&lang=ru&appid=" + apiKey;
		
		fetch(apiQuery)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				// console.log(data);
				showWeatherWidget(data);
			})
			.catch((error) => {
				console.error("Ошибка получение погоды. Причина: " + error);
			});
	}

}

let newWeatherWidget = function() {
	return new WeatherWidget();
}

let wWidgetWrapper = null;

function showWeatherWidget(data) {
	
	let today = new Date().toLocaleString("ru", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	let city = data.name;
	let temp = data.main.temp;
	let wDescription = data.weather[0].description;
	wDescription = wDescription.charAt(0).toUpperCase() + wDescription.slice(1);
	let windSpeed = data.wind.speed;
	let wIconId = data.weather[0].icon;

	wWidgetWrapper = document.createElement("div");
	wWidgetWrapper.id = "weather-widget__wrapper";
	wWidgetWrapper.style.cssText = `position: fixed; top: -100%; right: 20px; border-radius: 4px; background-color: #eee; padding: 18px; font-family: Arial; text-align: center;
		transition: all 1s ease-in-out;`;

	let wWidgetBtnCollapse = document.createElement("img");
	wWidgetBtnCollapse.src = "https://raw.githubusercontent.com/vrezkov/homework/main/close.png";
	wWidgetBtnCollapse.style.cssText = "position: absolute; display: block; top: 4px; right: 4px; width: 10px; height: 10px; cursor: pointer;";
	wWidgetBtnCollapse.addEventListener("click", wWidgetCollapse);

	let wWidgetBtnExpand = document.createElement("img");
	wWidgetBtnExpand.src = "https://raw.githubusercontent.com/vrezkov/homework/main/expand.png";
	wWidgetBtnExpand.style.cssText = "position: absolute; display: block; top: calc(50% - 5px); left: 4px; width: 10px; height: 10px; cursor: pointer; display: none;";
	wWidgetBtnExpand.addEventListener("click", wWidgetExpand);

	let wWidgetContent = document.createElement("div");
	wWidgetContent.style.cssText = "display: block; background-color: #fff; border-radius: 4px; padding: 18px; min-width: 180px; max-width: 180px;";

	let wWidgetToday = document.createElement("div");
	wWidgetToday.style.cssText = "display: block; font-size: 0.8em; margin-bottom: 2px;";
	wWidgetToday.innerHTML = `${today}`;

	let wWidgetCity = document.createElement("div");
	wWidgetCity.style.cssText = "display: block; font-size: 1.4em; font-weight: 700;";
	wWidgetCity.innerHTML = city;

	let wWidgetWIcon = document.createElement("img");
	wWidgetWIcon.src = `http://openweathermap.org/img/wn/${wIconId}@2x.png`;
	wWidgetWIcon.title = wDescription;
	wWidgetWIcon.style.cssText = "display: block; margin: 0 auto; max-width: 80px;";

	let wWidgetT = document.createElement("div");
	wWidgetT.style.cssText = "display: block; font-size: 1.8em; font-weight: 700;";
	wWidgetT.innerHTML = temp + " &#8451";

	let wWidgetWDetails = document.createElement("div");
	wWidgetWDetails.style.cssText = "display: block; font-size: 0.85em;";
	wWidgetWDetails.innerHTML = wDescription + ". Ветер: " + windSpeed + " м/c";

	let wWidgetWForecastLink = document.createElement("span");
	wWidgetWForecastLink.style.cssText = `display: inline-block; margin-top: 4px; font-size: 0.8em; color: #0066cc; text-decoration: none; border-bottom: 1px dashed #0066cc;
		cursor: pointer;`;
	wWidgetWForecastLink.innerHTML = "Прогноз на 3 дня";
	wWidgetWForecastLink.addEventListener("click", wWidgetForecastToggle);
	
	let wWidgetWForecast = document.createElement("div");
	wWidgetWForecast.style.cssText = "height: 0; overflow: hidden; opacity: 0; font-size: 0.85em; transition: all 1s ease-in-out;";

	wWidgetContent.append(wWidgetToday);
	wWidgetContent.append(wWidgetCity);
	wWidgetContent.append(wWidgetWIcon);
	wWidgetContent.append(wWidgetT);
	wWidgetContent.append(wWidgetWDetails);
	wWidgetContent.append(wWidgetWForecastLink);
	wWidgetContent.append(wWidgetWForecast);
	wWidgetWrapper.append(wWidgetContent);
	wWidgetWrapper.append(wWidgetBtnCollapse);
	wWidgetWrapper.append(wWidgetBtnExpand);
	document.body.append(wWidgetWrapper);
		
	function wWidgetCollapse() {
		wWidgetWrapper.style.right = `-${wWidgetWrapper.offsetWidth - 18}px`;
		wWidgetWrapper.addEventListener("transitionend", wWidgetBtnExpandShow);
	}

	function wWidgetBtnExpandShow() {
		wWidgetBtnExpand.style.display = "block";
	}

	function wWidgetExpand() {
		wWidgetWrapper.removeEventListener("transitionend", wWidgetBtnExpandShow);
		wWidgetWrapper.style.right = "20px";
		let that = this;
		wWidgetWrapper.addEventListener("transitionend", function() {
			that.style.display = "none";
		});
	}
	
	function wWidgetForecastToggle() {
		if (wWidgetWForecast.style.height === "0px") {
			wWidgetWForecast.style.height = "auto";
			wWidgetWForecast.style.opacity = "1";
			
			wWidgetWForecast.innerHTML = "";
			wWidgetWForecastLink.style.marginBottom = "18px";
			
			let loader = document.createElement("img");
			loader.id = "wWidgetWForecastLoader";
			loader.src = "https://raw.githubusercontent.com/vrezkov/homework/main/loader.gif";
			loader.style.cssText = "display: block; margin: 0 auto; max-width: 40px;";
			wWidgetWForecast.append(loader);
			
			let cityId = data.id,
				apiUrl = "https://api.openweathermap.org/data/2.5/",
				apiKey = "d82ce8a1358792b59a5ccab77b29da42",
				apiQuery = apiUrl+"/forecast?id=" + cityId + "&units=metric&lang=ru&appid=" + apiKey;
				
			fetch(apiQuery)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					// console.log(data);
					insertData(data);
				})
				.catch((error) => {
					console.error("Ошибка получение погоды. Причина: " + error);
				});

		} else {
			wWidgetWForecast.style.opacity = "0";
			wWidgetWForecast.style.height = "0px";
			wWidgetWForecastLink.style.marginBottom = "0px";
		}
	}
	
	function insertData(data) {
		setTimeout(function() {
						
			for (let i = 0; i < 3; i++) {
				
				let wWidgetWForecastNextDays__wrapper = document.createElement("div");
				wWidgetWForecastNextDays__wrapper.classList.add("wWidgetWForecastNextDays__wrapper");
				wWidgetWForecastNextDays__wrapper.style.cssText = "float: left; width: 33.333%; overflow: hidden; text-align: center;";
				wWidgetWForecast.append(wWidgetWForecastNextDays__wrapper);
				
				let wWidgetWForecastNextDays__date = document.createElement("div");
				wWidgetWForecastNextDays__date.classList.add("wWidgetWForecastNextDays__date");
				wWidgetWForecastNextDays__date.style.cssText = "font-size: 0.85em;";
				wWidgetWForecastNextDays__wrapper.append(wWidgetWForecastNextDays__date);
				
				let wWidgetWForecastNextDays__icon = document.createElement("img");
				wWidgetWForecastNextDays__icon.classList.add("wWidgetWForecastNextDays__icon");
				wWidgetWForecastNextDays__icon.style.cssText = "display: inline-block; margin: 0 auto; max-width: 40px;";
				wWidgetWForecastNextDays__wrapper.append(wWidgetWForecastNextDays__icon);
				
				let wWidgetWForecastNextDays__temp = document.createElement("div");
				wWidgetWForecastNextDays__temp.classList.add("wWidgetWForecastNextDays__temp");
				wWidgetWForecastNextDays__temp.style.cssText = "font-size: 0.85em;";
				wWidgetWForecastNextDays__wrapper.append(wWidgetWForecastNextDays__temp);
				
				let wWidgetWForecastNextDays__descr = document.createElement("div");
				wWidgetWForecastNextDays__descr.classList.add("wWidgetWForecastNextDays__descr");
				wWidgetWForecastNextDays__wrapper.append(wWidgetWForecastNextDays__descr);

			}
			
			let nextDate1 = new Date(new Date().setDate(new Date().getDate() + 1));
			let nextDate1Y = nextDate1.getFullYear();
			let nextDate1M = ("0" + (nextDate1.getMonth() + 1)).slice(-2);
			let nextDate1D = ("0" + nextDate1.getDate()).slice(-2);
			let nextDate1Str = nextDate1Y + "-" + nextDate1M + "-" + nextDate1D + " 12:00:00";
			let dataSet1 = null;
			
			let nextDate2 = new Date(new Date().setDate(new Date().getDate() + 2));
			let nextDate2Y = nextDate2.getFullYear();
			let nextDate2M = ("0" + (nextDate2.getMonth() + 1)).slice(-2);
			let nextDate2D = ("0" + nextDate2.getDate()).slice(-2);
			let nextDate2Str = nextDate2Y + "-" + nextDate2M + "-" + nextDate2D + " 12:00:00";
			let dataSet2 = null;

			let nextDate3 = new Date(new Date().setDate(new Date().getDate() + 3));
			let nextDate3Y = nextDate3.getFullYear();
			let nextDate3M = ("0" + (nextDate3.getMonth() + 1)).slice(-2);
			let nextDate3D = ("0" + nextDate3.getDate()).slice(-2);
			let nextDate3Str = nextDate3Y + "-" + nextDate3M + "-" + nextDate3D + " 12:00:00";
			let dataSet3 = null;

			for (let i = 0; i < data.list.length; i++) {
				if (data.list[i].dt_txt === nextDate1Str) {
					dataSet1 = data.list[i];
				}
				if (data.list[i].dt_txt === nextDate2Str) {
					dataSet2 = data.list[i];
				}
				if (data.list[i].dt_txt === nextDate3Str) {
					dataSet3 = data.list[i];
				}
			}
			
			for (let i = 0; i < document.querySelectorAll(".wWidgetWForecastNextDays__wrapper").length; i++) {
				
				let container = document.querySelectorAll(".wWidgetWForecastNextDays__wrapper");

				let date1 = nextDate1.toLocaleString("ru", {month: "short", day: "numeric"});
				let date2 = nextDate2.toLocaleString("ru", {month: "short", day: "numeric"});
				let date3 = nextDate3.toLocaleString("ru", {month: "short", day: "numeric"});

				container[0].querySelector(".wWidgetWForecastNextDays__date").innerHTML = date1;
				container[0].querySelector(".wWidgetWForecastNextDays__icon").src = "http://openweathermap.org/img/wn/" + dataSet1.weather[0].icon + "@2x.png";
				container[0].querySelector(".wWidgetWForecastNextDays__icon").title = dataSet1.weather[0].description;
				container[0].querySelector(".wWidgetWForecastNextDays__temp").innerHTML = dataSet1.main.temp + " &#8451";
				
				container[1].querySelector(".wWidgetWForecastNextDays__date").innerHTML = date2;
				container[1].querySelector(".wWidgetWForecastNextDays__icon").src = "http://openweathermap.org/img/wn/" + dataSet2.weather[0].icon + "@2x.png";
				container[1].querySelector(".wWidgetWForecastNextDays__icon").title = dataSet2.weather[0].description;
				container[1].querySelector(".wWidgetWForecastNextDays__temp").innerHTML = dataSet2.main.temp + " &#8451";
				
				container[2].querySelector(".wWidgetWForecastNextDays__date").innerHTML = date3;
				container[2].querySelector(".wWidgetWForecastNextDays__icon").src = "http://openweathermap.org/img/wn/" + dataSet3.weather[0].icon + "@2x.png";
				container[2].querySelector(".wWidgetWForecastNextDays__icon").title = dataSet3.weather[0].description;
				container[2].querySelector(".wWidgetWForecastNextDays__temp").innerHTML = dataSet3.main.temp + " &#8451";
				
			}
			
			document.querySelector("#wWidgetWForecastLoader").remove();

		}, 1000);
	}

	setTimeout(function() {
        wWidgetWrapper.style.top = "20px";
    }, 100);

}