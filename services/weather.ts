const API_KEY = "YOUR_OPENWEATHER_API_KEY"; // TODO: thay bằng API key của bạn
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Hàm fetch dữ liệu thời tiết từ OpenWeatherMap
 * @param city - Tên thành phố (VD: "Hà Nội")
 */
export async function fetchCurrentWeatherByCity(city: string) {
  // Nếu bạn chưa điền API_KEY thì trả dữ liệu fake để test UI
  if (!API_KEY || API_KEY === "YOUR_OPENWEATHER_API_KEY") {
    console.warn("⚠️ Chưa có API_KEY, đang dùng mock data để test.");
    return {
      main: { temp: 28, humidity: 75 },
      weather: [{ description: "Trời nắng nhẹ" }],
      wind: { speed: 2.5 },
    };
  }

  try {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(
      city
    )},VN&units=metric&lang=vi&appid=${API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`HTTP ${res.status}: ${msg}`);
    }
    return await res.json();
  } catch (err) {
    console.error("❌ Lỗi fetchCurrentWeatherByCity:", err);
    // Nếu API lỗi, trả dữ liệu mock để app vẫn chạy
    return {
      main: { temp: 0, humidity: 0 },
      weather: [{ description: "Không có dữ liệu" }],
      wind: { speed: 0 },
    };
  }
}
