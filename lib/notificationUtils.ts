/**
 * Utility function to extract and resolve notification destination URLs.
 * Supports "url", "action_url", "link", and nested fields inside "data".
 */
export function getNotificationUrl(notif: any, currentPathname?: string): string | null {
  if (!notif) return null;

  let rawUrl: string | null = null;

  // 1. Direct properties on notification
  if (typeof notif.url === "string" && notif.url.trim()) {
    rawUrl = notif.url.trim();
  } else if (typeof notif.action_url === "string" && notif.action_url.trim()) {
    rawUrl = notif.action_url.trim();
  } else if (typeof notif.link === "string" && notif.link.trim()) {
    rawUrl = notif.link.trim();
  } else if (typeof notif.target_url === "string" && notif.target_url.trim()) {
    rawUrl = notif.target_url.trim();
  } else if (typeof notif.redirect_url === "string" && notif.redirect_url.trim()) {
    rawUrl = notif.redirect_url.trim();
  } else if (notif.data) {
    // 2. Look inside notif.data (either JSON string or object)
    let dataObj = notif.data;
    if (typeof dataObj === "string") {
      try {
        dataObj = JSON.parse(dataObj);
      } catch {
        dataObj = null;
      }
    }
    if (dataObj && typeof dataObj === "object") {
      if (typeof dataObj.url === "string" && dataObj.url.trim()) {
        rawUrl = dataObj.url.trim();
      } else if (typeof dataObj.action_url === "string" && dataObj.action_url.trim()) {
        rawUrl = dataObj.action_url.trim();
      } else if (typeof dataObj.link === "string" && dataObj.link.trim()) {
        rawUrl = dataObj.link.trim();
      } else if (typeof dataObj.target_url === "string" && dataObj.target_url.trim()) {
        rawUrl = dataObj.target_url.trim();
      } else if (typeof dataObj.redirect_url === "string" && dataObj.redirect_url.trim()) {
        rawUrl = dataObj.redirect_url.trim();
      }
    }
  }

  if (!rawUrl) return null;

  // External URL
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }

  // Relative path ensure leading slash
  const path = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;

  // If path already contains a dashboard prefix, return as is
  if (
    path.startsWith("/trainer-dashboard") ||
    path.startsWith("/user-dashboard") ||
    path.startsWith("/nutritionist-dashboard") ||
    path.startsWith("/supplier-dashboard") ||
    path.startsWith("/admin-dashboard") ||
    path.startsWith("/api-user")
  ) {
    return path;
  }

  const pathname = currentPathname || "";
  const isTrainer = pathname.startsWith("/trainer-dashboard");
  const isUser = pathname.startsWith("/user-dashboard");
  const isNutritionist = pathname.startsWith("/nutritionist-dashboard");
  const isSupplier = pathname.startsWith("/supplier-dashboard");
  const isAdmin = pathname.startsWith("/admin-dashboard");

  // Shorthand: /calendar
  if (path === "/calendar" || path.startsWith("/calendar/")) {
    const sub = path.replace(/^\/calendar/, "");
    if (isUser) return `/user-dashboard/schedule${sub}`;
    if (isTrainer) return `/trainer-dashboard/calendar${sub}`;
    return `/trainer-dashboard/calendar${sub}`;
  }

  // Shorthand: /schedule
  if (path === "/schedule" || path.startsWith("/schedule/")) {
    const sub = path.replace(/^\/schedule/, "");
    if (isTrainer) return `/trainer-dashboard/calendar${sub}`;
    return `/user-dashboard/schedule${sub}`;
  }

  // Shorthand: /messages
  if (path === "/messages" || path.startsWith("/messages/")) {
    if (isTrainer) return `/trainer-dashboard${path}`;
    if (isNutritionist) return `/nutritionist-dashboard${path}`;
    if (isSupplier) return `/supplier-dashboard${path}`;
    return `/user-dashboard${path}`;
  }

  // Shorthand: /clients
  if (path === "/clients" || path.startsWith("/clients/")) {
    if (isTrainer) return `/trainer-dashboard${path}`;
    if (isNutritionist) return `/nutritionist-dashboard${path}`;
    if (isSupplier) return `/supplier-dashboard${path}`;
    return `/trainer-dashboard${path}`;
  }


  // Shorthand: /insights
    if (path === "/insights" || path.startsWith("/insights/")) {
      if (isTrainer) return `/trainer-dashboard${path}`;
      if (isNutritionist) return `/nutritionist-dashboard${path}`;
      if (isSupplier) return `/supplier-dashboard${path}`;
      return `/user-dashboard${path}`;
    }

  //Programs
    if (path === "/programs" || path.startsWith("/programs/")) {
      if (isTrainer) return `/trainer-dashboard${path}`;
      if (isNutritionist) return `/nutritionist-dashboard${path}`;
      if (isSupplier) return `/supplier-dashboard${path}`;
      return `/user-dashboard${path}`;
    }
  // Shorthand: /settings
  if (path === "/settings" || path.startsWith("/settings/")) {
    if (isTrainer) return `/trainer-dashboard${path}`;
    if (isNutritionist) return `/nutritionist-dashboard${path}`;
    if (isSupplier) return `/supplier-dashboard${path}`;
    if (isAdmin) return `/admin-dashboard${path}`;
    return `/user-dashboard${path}`;
  }

  // Shorthand: /notifications
  if (path === "/notifications" || path.startsWith("/notifications/")) {
    if (isTrainer) return `/trainer-dashboard${path}`;
    if (isNutritionist) return `/nutritionist-dashboard${path}`;
    if (isSupplier) return `/supplier-dashboard${path}`;
    if (isAdmin) return `/admin-dashboard${path}`;
    return `/user-dashboard${path}`;
  }

  // Shorthand: /overview
  if (path === "/overview" || path.startsWith("/overview/")) {
    if (isTrainer) return `/trainer-dashboard${path}`;
    if (isNutritionist) return `/nutritionist-dashboard${path}`;
    if (isAdmin) return `/admin-dashboard${path}`;
    return `/user-dashboard`;
  }

  return path;
}
