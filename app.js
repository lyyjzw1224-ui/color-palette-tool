const palettes = [
  {
    id: "culture",
    title: "国潮文旅",
    description: "朱砂与青黛，适合古镇海报与非遗展陈。",
    colors: [
      ["朱砂", "#A83427"], ["青黛", "#234548"], ["鎏金", "#C38D40"],
      ["宣纸", "#F1E4CC"], ["墨黑", "#27231F"],
    ],
  },
  {
    id: "tech",
    title: "科技发布会",
    description: "深靛作底，亮蓝与青绿突出产品信息。",
    colors: [
      ["深靛", "#151A3D"], ["电光蓝", "#365AF4"], ["极光青", "#35DEC9"],
      ["雾紫", "#ABAAF5"], ["霜白", "#F1F4FF"],
    ],
  },
  {
    id: "public",
    title: "政府公益宣传",
    description: "稳重的蓝绿搭配暖黄，适合社区服务与公益倡议。",
    colors: [
      ["政务蓝", "#234C73"], ["社区绿", "#327C63"], ["暖阳黄", "#F2BD58"],
      ["浅青", "#DCEEE5"], ["米白", "#FAF6ED"],
    ],
  },
];

const notice = document.querySelector("#notice");
let noticeTimer;

async function copyHex(hex) {
  try {
    await navigator.clipboard.writeText(hex);
  } catch {
    // 本地文件或浏览器限制剪贴板 API 时，尝试传统复制方式。
    const field = document.createElement("textarea");
    field.value = hex;
    field.readOnly = true;
    field.style.cssText = "position:fixed;left:0;top:0;opacity:0";
    const previousFocus = document.activeElement;
    document.body.append(field);
    try {
      field.select();
      field.setSelectionRange(0, hex.length);
      if (!document.execCommand("copy")) throw new Error("复制失败");
    } finally {
      field.remove();
      previousFocus?.focus({ preventScroll: true });
    }
  }
}

const container = document.querySelector("#palettes");
for (const { id, title, description, colors } of palettes) {
  const section = document.createElement("section");
  section.className = "palette";
  section.id = id;
  section.setAttribute("aria-labelledby", id + "-title");
  section.innerHTML = `
    <div class="heading">
      <h2 id="${id}-title">${title}</h2>
      <p>${description}</p>
    </div>
    <div class="cards"></div>
  `;
  const cards = section.querySelector(".cards");

  for (const [name, hex] of colors) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    button.setAttribute("aria-label", `复制${name} ${hex}`);
    button.style.setProperty("--swatch", hex);
    button.innerHTML = `
      <span class="swatch" aria-hidden="true"></span>
      <span class="caption"><span>${name}</span><span class="hex">${hex}</span></span>
    `;
    button.addEventListener("click", async () => {
      let message;
      try {
        await copyHex(hex);
        message = `已复制 ${hex}`;
      } catch {
        message = `浏览器未能复制，请手动复制 ${hex}`;
      }
      clearTimeout(noticeTimer);
      notice.textContent = message;
      noticeTimer = setTimeout(() => { notice.textContent = ""; }, 3000);
    });
    cards.append(button);
  }
  container.append(section);
}
