const func = {}

func.userDefault = function () {
  return "./assets/images/logo.png"
};

func.getMediaType = function (url) {
  if (url) {
    const images = ["jpg", "jpeg", "gif", "png"]
    const videos = ["mp4", "mov", "3gp", "ogg"]
    const extension = url.split(".").pop()
    if (images.includes(extension)) {
      return "image"
    } else if (videos.includes(extension)) {
      return "video"
    } else {
      return "unknown"
    }
  } else {
    return "empty"
  }
};

func.calculatePagination = function (data) {
  let totalPage = data.total / data.limit
  let pagination = {
    limit: data.limit,
    page: ((data.offset + data.limit) - data.limit) + 1,
    total: data.total,
    totalPage: totalPage > parseInt(totalPage) ? parseInt(totalPage) + 1 : parseInt(totalPage),
  }
  return pagination
};

func.base64toFile = function (dataurl, filename) {
  var arr = dataurl.split(","),
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: "image/jpeg"
  });
};

func.getFullImage = function (path) {
  return process.env.VUE_APP_BASE_URL_IMAGE + path + "?cache=none"
};

func.timeToMillisecond = function (t) {
  var h = Number(t.split(':')[0]) * 60 * 60
  var m = Number(t.split(':')[1]) * 60
  var s = Number(t.split(':')[2]);
  let val = (h + m + s) * 1000
  return val
};
func.durationToTime = function (duration) {
  // var milliseconds = parseInt((duration % 1000) / 100),
  var seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  return hours + ":" + minutes + ":" + seconds;
};

func.convertToPlain = function (html) {
  var tempDivElement = document.createElement("div");
  // Set the HTML content with the given value
  tempDivElement.innerHTML = html;

  // Retrieve the text property of the element 
  return tempDivElement.textContent || tempDivElement.innerText || "";
}
export default func;