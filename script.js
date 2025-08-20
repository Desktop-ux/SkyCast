let searchbtn = document.querySelector(".search")
let cityinp = document.querySelector(".cityinp")
let app = document.querySelector(".app-container")
let intro = document.querySelector(".intro")
let main = document.querySelector(".main")
let interrupt = document.querySelector(".interrupt")
let tryAgainbtn = document.querySelector(".try-again")

// Show Interrupt
function showinterrupt(){
  interrupt.classList.remove("hidden")
  setTimeout(() => {
    interrupt.classList.add("opacity-100")
  }, 10);
}

// Hide interrupt
function hidinterrupt(){
  interrupt.classList.remove("opacity-100")
  setTimeout(() => {
    interrupt.classList.add("hidden")
  }, 500);
}

function getinfo(country) {
  return fetch(`https://api.weatherapi.com/v1/forecast.json?key=9eac2a67633c41dc802112234252008&q=${country}&days=1&aqi=no&alerts=no`).then((raw) => {
    return raw.json()
  })
}

// Weather conditions mapping
const weatherConditions = {
  1000: { label: "Sunny / Clear", background: "bg-gradient-to-b from-yellow-500 to-orange-700", animation: "sunnyAnimation" },
  1003: { label: "Partly Cloudy", background: "bg-gradient-to-b from-sky-500 to-gray-700", animation: "cloudyAnimation" },
  1006: { label: "Cloudy", background: "bg-gradient-to-b from-gray-500 to-gray-800", animation: "cloudyAnimation" },
  1009: { label: "Overcast", background: "bg-gradient-to-b from-gray-600 to-gray-900", animation: "overcastAnimation" },
  1030: { label: "Mist", background: "bg-gradient-to-b from-gray-400 to-gray-700", animation: "fogAnimation" },
  1063: { label: "Patchy Rain", background: "bg-gradient-to-b from-blue-400 to-gray-600", animation: "rainAnimation" },
  1072: { label: "Patchy Freezing Drizzle", background: "bg-gradient-to-b from-blue-200 to-gray-500", animation: "drizzleAnimation" },
  1114: { label: "Blowing Snow", background: "bg-gradient-to-b from-gray-200 to-blue-400", animation: "snowWindAnimation" },
  1135: { label: "Fog", background: "bg-gradient-to-b from-gray-500 to-gray-700", animation: "fogAnimation" },
  1147: { label: "Freezing Fog", background: "bg-gradient-to-b from-gray-400 to-gray-600", animation: "iceFogAnimation" },
  1150: { label: "Light Drizzle", background: "bg-gradient-to-b from-blue-300 to-blue-600", animation: "drizzleAnimation" },
  1180: { label: "Light Rain", background: "bg-gradient-to-b from-blue-500 to-blue-800", animation: "rainAnimation" },
  1183: { label: "Moderate Rain", background: "bg-gradient-to-b from-blue-600 to-gray-800", animation: "rainAnimation" },
  1195: { label: "Heavy Rain", background: "bg-gradient-to-b from-indigo-700 to-gray-900", animation: "stormAnimation" },
  1210: { label: "Light Snow", background: "bg-gradient-to-b from-blue-200 to-white", animation: "snowAnimation" },
  1213: { label: "Moderate Snow", background: "bg-gradient-to-b from-blue-300 to-gray-200", animation: "snowAnimation" },
  1225: { label: "Heavy Snow", background: "bg-gradient-to-b from-gray-300 to-white", animation: "snowStormAnimation" },
  1240: { label: "Rain Showers", background: "bg-gradient-to-b from-sky-600 to-gray-800", animation: "rainAnimation" },
  1243: { label: "Heavy Showers", background: "bg-gradient-to-b from-indigo-700 to-gray-900", animation: "stormAnimation" },
  1273: { label: "Thunderstorm", background: "bg-gradient-to-b from-purple-700 to-gray-900", animation: "thunderAnimation" },
  1282: { label: "Severe Thunderstorm", background: "bg-gradient-to-b from-red-800 to-black", animation: "severeThunderAnimation" }
};

function decorateui(details) {
  let conditionCode = details.current.condition.code;
  let condition = weatherConditions[conditionCode] || {
    label: details.current.condition.text,
    background: "bg-gradient-to-b from-gray-700 to-black",
    animation: "defaultAnimation"
  };

  // Apply background style to app container
  app.className = `app-container flex flex-col items-center justify-center p-6 ${condition.background}`;


  let data = `
      <h2 class="text-2xl font-semibold text-gray-200">${details.location.name}, ${details.location.country}</h2>
      <p class="text-6xl font-bold text-yellow-400">${details.current.temp_c}°C</p>
      <p class="capitalize text-lg text-gray-200">${condition.label}</p>
      
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-3">
          <p class="text-sm text-gray-400">💧 Humidity</p>
          <p class="font-semibold text-gray-200">${details.current.humidity}%</p>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-3">
          <p class="text-sm text-gray-400">🌬️ Wind</p>
          <p class="font-semibold text-gray-200">${details.current.wind_kph} K/hr</p>
        </div>
      </div>
    `;

  app.innerHTML = data;
}


window.addEventListener("load", function () {
  let t1 = gsap.timeline()

  t1.to(".intro", {
    opacity: 1,
    y: -20,
    duration: 1.5,
    ease: "power2.out"
  })
  t1.to(".intro", {
    opacity: 0,
    duration: 0.5,
    delay: 1
  })

  t1.add(() => {
    intro.style.display = "none"
    main.classList.remove("hidden")
  })

  t1.to(".main", {
    opacity: 1,
    y: -10,
    duration: 1,
    ease: "back.out(1.7)"
  })
})


searchbtn.addEventListener("click", function () {
  
  let city = cityinp.value.trim()
  if (city.length > 0) {
    getinfo(city).then(data => {
      console.log(data)
      decorateui(data)
    })
    gsap.to(".app-container", {
      opacity: 1,
      y: -10,
      duration: 1.5,
      ease: "power2.out"
    });

  }
  //  else {
  //    getinfo(city).then(data => {
  //     if (data.error) {
  //       showinterrupt();
  //     }
  //   }).catch(() => {
  //     showinterrupt();
  //   });
  // }
   if (city.length === 0) {
    // Empty input → directly show interrupt
    showinterrupt();
    return;
  }

  getinfo(city).then(data => {
    if (data.error) {
      // API returned an error → show interrupt
      showinterrupt();
    } else {
      // Valid response → decorate UI
      decorateui(data);
      gsap.to(".app-container", {
        opacity: 1,
        y: -10,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  }).catch(() => {
    // Network or API failure → show interrupt
    showinterrupt();
  });
})


tryAgainbtn.addEventListener("click", function () {
  hidinterrupt();
  cityinp.value = ""; // optional: clear input
});