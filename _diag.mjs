const urls = ["http://localhost:8080/", "http://localhost:8080/login"];

for (const url of urls) {
  const res = await fetch(url);
  const html = await res.text();
  console.log("\n===", url, "status", res.status);
  console.log("error page:", html.includes("didn't load"));
  console.log("risk sentinel:", html.includes("Risk Sentinel"));
  const title = html.match(/<title>([^<]*)<\/title>/);
  console.log("title:", title?.[1]);

  const entry = html.match(/src="([^"]*tanstack-start-dev-client-entry[^"]*)"/);
  if (entry) {
    const er = await fetch(new URL(entry[1], url));
    console.log("client entry status:", er.status, "bytes:", (await er.text()).length);
  }
}

// Hit LAN IP too
const lan = "http://172.20.10.3:8080/";
try {
  const res = await fetch(lan);
  const html = await res.text();
  console.log("\n=== LAN", lan, "status", res.status);
  console.log("error page:", html.includes("didn't load"));
  console.log("risk sentinel:", html.includes("Risk Sentinel"));
} catch (e) {
  console.log("\n=== LAN failed", e.message);
}
