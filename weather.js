const weatherCode = {
    100: ["100.svg", "500.svg", "晴れ"],
    101: ["101.svg", "501.svg", "晴れ時々曇り"],
    102: ["102.svg", "502.svg", "晴れ一時雨"],
    103: ["102.svg", "502.svg", "晴れ時々雨"],
    104: ["104.svg", "504.svg", "晴れ一時雪"],
    105: ["104.svg", "504.svg", "晴れ時々雪"],
    106: ["102.svg", "502.svg", "晴れ一時雨か雪"],
    107: ["102.svg", "502.svg", "晴れ時々雨か雪"],
    108: ["102.svg", "502.svg", "晴れ一時雨か雷雨"],
    110: ["110.svg", "510.svg", "晴れ後時々曇り"],
    111: ["110.svg", "510.svg", "晴れ後曇り"],
    112: ["112.svg", "512.svg", "晴れ後一時雨"],
    113: ["112.svg", "512.svg", "晴れ後時々雨"],
    114: ["112.svg", "512.svg", "晴れ後雨"],
    115: ["115.svg", "515.svg", "晴れ後一時雪"],
    116: ["115.svg", "515.svg", "晴れ後時々雪"],
    117: ["115.svg", "515.svg", "晴れ後雪"],
    118: ["112.svg", "512.svg", "晴れ後雨か雪"],
    119: ["112.svg", "512.svg", "晴れ後雨か雷雨"],
    200: ["200.svg", "200.svg", "曇り"],
    201: ["201.svg", "601.svg", "曇り時々晴れ"],
    202: ["202.svg", "202.svg", "曇り一時雨"],
    203: ["202.svg", "202.svg", "曇り時々雨"],
    204: ["204.svg", "204.svg", "曇り一時雪"],
    205: ["204.svg", "204.svg", "曇り時々雪"],
    300: ["300.svg", "300.svg", "雨"],
    301: ["301.svg", "701.svg", "雨時々晴れ"],
    302: ["302.svg", "302.svg", "雨時々止む"],
    400: ["400.svg", "400.svg", "雪"],
    401: ["401.svg", "801.svg", "雪時々晴れ"],
    402: ["402.svg", "402.svg", "雪時々止む"],
    340: ["400.svg", "400.svg", "雪か雨"]
  };
  
  const url = "https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json";
  const dayList = ["日", "月", "火", "水", "木", "金", "土"];
  
  fetch(url)
      .then(response => response.json())
      .then(weather => {
          document.querySelector(".footer a").prepend(
              `${weather[1].publishingOffice}: ${weather[1].timeSeries[0].areas[0].area.name} `
          );
  
          const weatherCodeList = [];
          const timeDefinesList = [];
          const tempsMinList = [];
          const tempsMaxList = [];
  
          // **今日と明日のデータを取得**
          const weatherCodes = weather[0].timeSeries[0].areas[0].weatherCodes;
          const timeDefines = weather[0].timeSeries[0].timeDefines;
          const temps = weather[0].timeSeries[2].areas[0].temps;
  
          weatherCodeList.push(...weatherCodes.slice(0, 2));
          timeDefinesList.push(...timeDefines.slice(0, 2));
  
          tempsMinList.push("--", temps[0] ?? "--");  // **最小気温を1日ずらす**
          tempsMaxList.push("--", temps[1] ?? "--");  // **最大気温を1日ずらす**
  
          // **3日目以降のデータを取得**
          const startIndex = weather[1].timeSeries[0].timeDefines.indexOf(timeDefines[1]) + 1;
          for (let i = startIndex; i < startIndex + 5; i++) {
              weatherCodeList.push(weather[1].timeSeries[0].areas[0].weatherCodes[i]);
              timeDefinesList.push(weather[1].timeSeries[0].timeDefines[i]);
              tempsMinList.push(weather[1].timeSeries[1].areas[0].tempsMin[i - startIndex + 1] ?? "--");
              tempsMaxList.push(weather[1].timeSeries[1].areas[0].tempsMax[i - startIndex + 1] ?? "--");
          }
  
          const weatherContainer = document.querySelector(".weatherForecast");
          weatherContainer.innerHTML = "";
  
          // **0~6 のループで1週間分を処理**
          for (let i = 0; i < 7; i++) {
              if (!timeDefinesList[i]) continue;
  
              let dt = new Date(timeDefinesList[i]);
              let weekdayCount = dt.getDay();
              let dateText = `${dt.getMonth() + 1}/${dt.getDate()}(${dayList[weekdayCount]})`;
  
              let code = weatherCodeList[i];
              let weatherIcon = "https://www.jma.go.jp/bosai/forecast/img/" + (weatherCode[code] ? weatherCode[code][0] : "200.svg");
              let weatherText = weatherCode[code] ? weatherCode[code][2] : "データなし";
  
              let minTemp = tempsMinList[i] !== "--" && tempsMinList[i] !== undefined ? `${tempsMinList[i]}℃` : "--℃";
              let maxTemp = tempsMaxList[i] !== "--" && tempsMaxList[i] !== undefined ? `${tempsMaxList[i]}℃` : "--℃";
  
              let weatherHTML = `
                  <div class="weather">
                      <div class="date">${dateText}</div>
                      <img class="weatherImg" src="${weatherIcon}" alt="${weatherText}">
                      <div class="weatherTelop">${weatherText}</div>
                      <div class="temperature">
                          <span class="tempMin">${minTemp}</span> / 
                          <span class="tempMax">${maxTemp}</span>
                      </div>
                  </div>
              `;
              weatherContainer.innerHTML += weatherHTML;
          }
      })
      .catch(error => console.error("天気データの取得に失敗しました:", error));
  
