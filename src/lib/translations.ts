// ============================================================
// Carta — i18n Translations for Customer Table Experience
// ============================================================

export type Locale = "en" | "es" | "fr" | "zh" | "ja" | "ar" | "ko" | "de";

export interface LangOption {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  dir?: "ltr" | "rtl";
}

export const languages: LangOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
];

// ── Translation strings ─────────────────────────────────────

export interface Translations {
  // Welcome
  welcome: string;
  welcomeSubtitle: string;
  seatedAt: string;
  seats: string;
  table: string;
  startOrdering: string;
  welcomeFooter: string;
  tableNotFound: string;
  tableNotFoundDesc: string;
  selectLanguage: string;

  // Menu
  ourMenu: string;
  menuSubtitle: string;
  popular: string;
  add: string;
  added: string;
  noItems: string;

  // Cart
  yourCart: string;
  cartEmpty: string;
  cartEmptyDesc: string;
  browseMenu: string;
  specialInstructions: string;
  orderSummary: string;
  subtotal: string;
  tax: string;
  total: string;
  placeOrder: string;
  viewCart: string;

  // Tracker
  orderPlaced: string;
  orderPlacedDesc: string;
  preparing: string;
  preparingDesc: string;
  readyToServe: string;
  readyToServeDesc: string;
  orderReady: string;
  orderInProgress: string;
  order: string;
  estimatedWait: string;
  waitPlaced: string;
  waitPreparing: string;
  orderDetails: string;
  orderMore: string;

  // Requests
  needSomething: string;
  requestSubtitle: string;
  requestSent: string;
  requestSentDesc: string;
  customRequest: string;
  typePlaceholder: string;
  howItWorks: string;
  howItWorksDesc: string;

  // Quick request labels
  waterRefill: string;
  callWaiter: string;
  getBill: string;
  extraCutlery: string;
  napkins: string;
  cleanTable: string;

  // Quick request messages
  waterRefillMsg: string;
  callWaiterMsg: string;
  getBillMsg: string;
  extraCutleryMsg: string;
  napkinsMsg: string;
  cleanTableMsg: string;

  // Nav
  menu: string;
  cart: string;
  myOrder: string;
  requests: string;
}

const en: Translations = {
  welcome: "Welcome to Carta",
  welcomeSubtitle: "Digital dining experience, right at your fingertips",
  seatedAt: "You are seated at",
  seats: "seats",
  table: "table",
  startOrdering: "Start Ordering",
  welcomeFooter: "Browse our menu, order & request anything — all from your phone",
  tableNotFound: "Table not found",
  tableNotFoundDesc: "Please scan the QR code on your table again",
  selectLanguage: "Select your language",
  ourMenu: "Our Menu",
  menuSubtitle: "Fresh ingredients, crafted with love ✨",
  popular: "Popular",
  add: "Add",
  added: "Added",
  noItems: "No items in this category",
  yourCart: "Your Cart",
  cartEmpty: "Your cart is empty",
  cartEmptyDesc: "Browse the menu and add some delicious items",
  browseMenu: "Browse Menu",
  specialInstructions: "Add special instructions...",
  orderSummary: "Order Summary",
  subtotal: "Subtotal",
  tax: "Tax (8%)",
  total: "Total",
  placeOrder: "Place Order",
  viewCart: "View Cart",
  orderPlaced: "Order Placed",
  orderPlacedDesc: "Your order has been received",
  preparing: "Preparing",
  preparingDesc: "The kitchen is working on it",
  readyToServe: "Ready to Serve",
  readyToServeDesc: "Your food is on its way!",
  orderReady: "Your order is ready! 🎉",
  orderInProgress: "Order in Progress",
  order: "Order",
  estimatedWait: "Estimated wait time",
  waitPlaced: "15–20 minutes",
  waitPreparing: "5–10 minutes",
  orderDetails: "Order Details",
  orderMore: "Order More Items",
  needSomething: "Need Something?",
  requestSubtitle: "Tap a quick request or type your own message",
  requestSent: "Request sent!",
  requestSentDesc: "Our staff will be with you shortly",
  customRequest: "Custom Request",
  typePlaceholder: "Type your request here...",
  howItWorks: "How it works",
  howItWorksDesc: "Your request is sent directly to our staff in real-time. They will attend to you as soon as possible.",
  waterRefill: "Water Refill",
  callWaiter: "Call Waiter",
  getBill: "Get the Bill",
  extraCutlery: "Extra Cutlery",
  napkins: "Napkins",
  cleanTable: "Clean Table",
  waterRefillMsg: "Can we get a water refill please?",
  callWaiterMsg: "We'd like to speak with a waiter",
  getBillMsg: "Can we get the bill please?",
  extraCutleryMsg: "We need extra cutlery please",
  napkinsMsg: "Can we get more napkins?",
  cleanTableMsg: "Could you clean our table please?",
  menu: "Menu",
  cart: "Cart",
  myOrder: "My Order",
  requests: "Requests",
};

const es: Translations = {
  welcome: "Bienvenido a Carta",
  welcomeSubtitle: "Experiencia gastronómica digital, al alcance de tu mano",
  seatedAt: "Estás sentado en",
  seats: "asientos",
  table: "mesa",
  startOrdering: "Comenzar a Pedir",
  welcomeFooter: "Explora nuestro menú, pide y solicita lo que necesites — todo desde tu teléfono",
  tableNotFound: "Mesa no encontrada",
  tableNotFoundDesc: "Por favor, escanea el código QR de tu mesa nuevamente",
  selectLanguage: "Selecciona tu idioma",
  ourMenu: "Nuestro Menú",
  menuSubtitle: "Ingredientes frescos, preparados con amor ✨",
  popular: "Popular",
  add: "Añadir",
  added: "Añadido",
  noItems: "No hay artículos en esta categoría",
  yourCart: "Tu Carrito",
  cartEmpty: "Tu carrito está vacío",
  cartEmptyDesc: "Explora el menú y añade algunos platos deliciosos",
  browseMenu: "Ver Menú",
  specialInstructions: "Añadir instrucciones especiales...",
  orderSummary: "Resumen del Pedido",
  subtotal: "Subtotal",
  tax: "Impuesto (8%)",
  total: "Total",
  placeOrder: "Realizar Pedido",
  viewCart: "Ver Carrito",
  orderPlaced: "Pedido Realizado",
  orderPlacedDesc: "Tu pedido ha sido recibido",
  preparing: "Preparando",
  preparingDesc: "La cocina está trabajando en ello",
  readyToServe: "Listo para Servir",
  readyToServeDesc: "¡Tu comida está en camino!",
  orderReady: "¡Tu pedido está listo! 🎉",
  orderInProgress: "Pedido en Progreso",
  order: "Pedido",
  estimatedWait: "Tiempo de espera estimado",
  waitPlaced: "15–20 minutos",
  waitPreparing: "5–10 minutos",
  orderDetails: "Detalles del Pedido",
  orderMore: "Pedir Más",
  needSomething: "¿Necesitas algo?",
  requestSubtitle: "Toca una solicitud rápida o escribe tu mensaje",
  requestSent: "¡Solicitud enviada!",
  requestSentDesc: "Nuestro personal te atenderá en breve",
  customRequest: "Solicitud Personalizada",
  typePlaceholder: "Escribe tu solicitud aquí...",
  howItWorks: "Cómo funciona",
  howItWorksDesc: "Tu solicitud se envía directamente a nuestro personal en tiempo real. Te atenderán lo antes posible.",
  waterRefill: "Rellenar Agua",
  callWaiter: "Llamar Mesero",
  getBill: "Pedir la Cuenta",
  extraCutlery: "Cubiertos Extra",
  napkins: "Servilletas",
  cleanTable: "Limpiar Mesa",
  waterRefillMsg: "¿Pueden rellenar el agua, por favor?",
  callWaiterMsg: "Nos gustaría hablar con un mesero",
  getBillMsg: "¿Nos pueden traer la cuenta, por favor?",
  extraCutleryMsg: "Necesitamos cubiertos extra, por favor",
  napkinsMsg: "¿Nos pueden traer más servilletas?",
  cleanTableMsg: "¿Podrían limpiar nuestra mesa, por favor?",
  menu: "Menú",
  cart: "Carrito",
  myOrder: "Mi Pedido",
  requests: "Solicitudes",
};

const fr: Translations = {
  welcome: "Bienvenue chez Carta",
  welcomeSubtitle: "L'expérience culinaire numérique, à portée de main",
  seatedAt: "Vous êtes assis à",
  seats: "places",
  table: "table",
  startOrdering: "Commencer la Commande",
  welcomeFooter: "Parcourez notre menu, commandez et demandez ce que vous voulez — depuis votre téléphone",
  tableNotFound: "Table non trouvée",
  tableNotFoundDesc: "Veuillez scanner à nouveau le code QR sur votre table",
  selectLanguage: "Choisissez votre langue",
  ourMenu: "Notre Menu",
  menuSubtitle: "Ingrédients frais, préparés avec amour ✨",
  popular: "Populaire",
  add: "Ajouter",
  added: "Ajouté",
  noItems: "Aucun article dans cette catégorie",
  yourCart: "Votre Panier",
  cartEmpty: "Votre panier est vide",
  cartEmptyDesc: "Parcourez le menu et ajoutez de délicieux plats",
  browseMenu: "Voir le Menu",
  specialInstructions: "Ajouter des instructions spéciales...",
  orderSummary: "Résumé de la Commande",
  subtotal: "Sous-total",
  tax: "Taxe (8%)",
  total: "Total",
  placeOrder: "Passer la Commande",
  viewCart: "Voir le Panier",
  orderPlaced: "Commande Passée",
  orderPlacedDesc: "Votre commande a été reçue",
  preparing: "En Préparation",
  preparingDesc: "La cuisine s'en occupe",
  readyToServe: "Prêt à Servir",
  readyToServeDesc: "Votre repas arrive !",
  orderReady: "Votre commande est prête ! 🎉",
  orderInProgress: "Commande en Cours",
  order: "Commande",
  estimatedWait: "Temps d'attente estimé",
  waitPlaced: "15–20 minutes",
  waitPreparing: "5–10 minutes",
  orderDetails: "Détails de la Commande",
  orderMore: "Commander Plus",
  needSomething: "Besoin de quelque chose ?",
  requestSubtitle: "Appuyez sur une demande rapide ou tapez votre message",
  requestSent: "Demande envoyée !",
  requestSentDesc: "Notre personnel vous assistera sous peu",
  customRequest: "Demande Personnalisée",
  typePlaceholder: "Tapez votre demande ici...",
  howItWorks: "Comment ça marche",
  howItWorksDesc: "Votre demande est envoyée directement à notre personnel en temps réel. Ils vous assisteront dès que possible.",
  waterRefill: "Recharge d'Eau",
  callWaiter: "Appeler le Serveur",
  getBill: "Demander l'Addition",
  extraCutlery: "Couverts Supplémentaires",
  napkins: "Serviettes",
  cleanTable: "Nettoyer la Table",
  waterRefillMsg: "Pouvons-nous avoir un recharge d'eau s'il vous plaît ?",
  callWaiterMsg: "Nous aimerions parler à un serveur",
  getBillMsg: "Pouvons-nous avoir l'addition s'il vous plaît ?",
  extraCutleryMsg: "Nous avons besoin de couverts supplémentaires s'il vous plaît",
  napkinsMsg: "Pouvons-nous avoir plus de serviettes ?",
  cleanTableMsg: "Pourriez-vous nettoyer notre table s'il vous plaît ?",
  menu: "Menu",
  cart: "Panier",
  myOrder: "Ma Commande",
  requests: "Demandes",
};

const de: Translations = {
  welcome: "Willkommen bei Carta",
  welcomeSubtitle: "Digitales Speiseerlebnis, direkt in Ihrer Hand",
  seatedAt: "Sie sitzen an",
  seats: "Plätze",
  table: "Tisch",
  startOrdering: "Jetzt Bestellen",
  welcomeFooter: "Stöbern Sie in unserem Menü, bestellen und wünschen Sie sich alles — direkt vom Handy",
  tableNotFound: "Tisch nicht gefunden",
  tableNotFoundDesc: "Bitte scannen Sie den QR-Code auf Ihrem Tisch erneut",
  selectLanguage: "Wählen Sie Ihre Sprache",
  ourMenu: "Unsere Speisekarte",
  menuSubtitle: "Frische Zutaten, mit Liebe zubereitet ✨",
  popular: "Beliebt",
  add: "Hinzufügen",
  added: "Hinzugefügt",
  noItems: "Keine Artikel in dieser Kategorie",
  yourCart: "Ihr Warenkorb",
  cartEmpty: "Ihr Warenkorb ist leer",
  cartEmptyDesc: "Stöbern Sie im Menü und fügen Sie leckere Gerichte hinzu",
  browseMenu: "Menü Durchstöbern",
  specialInstructions: "Sonderwünsche hinzufügen...",
  orderSummary: "Bestellübersicht",
  subtotal: "Zwischensumme",
  tax: "Steuer (8%)",
  total: "Gesamt",
  placeOrder: "Bestellen",
  viewCart: "Warenkorb Ansehen",
  orderPlaced: "Bestellt",
  orderPlacedDesc: "Ihre Bestellung wurde empfangen",
  preparing: "Wird Zubereitet",
  preparingDesc: "Die Küche arbeitet daran",
  readyToServe: "Bereit zum Servieren",
  readyToServeDesc: "Ihr Essen kommt gleich!",
  orderReady: "Ihre Bestellung ist fertig! 🎉",
  orderInProgress: "Bestellung in Bearbeitung",
  order: "Bestellung",
  estimatedWait: "Geschätzte Wartezeit",
  waitPlaced: "15–20 Minuten",
  waitPreparing: "5–10 Minuten",
  orderDetails: "Bestelldetails",
  orderMore: "Mehr Bestellen",
  needSomething: "Brauchen Sie etwas?",
  requestSubtitle: "Tippen Sie auf eine Schnellanfrage oder geben Sie Ihre Nachricht ein",
  requestSent: "Anfrage gesendet!",
  requestSentDesc: "Unser Personal wird sich kurz bei Ihnen melden",
  customRequest: "Eigene Anfrage",
  typePlaceholder: "Geben Sie Ihre Anfrage hier ein...",
  howItWorks: "So funktioniert's",
  howItWorksDesc: "Ihre Anfrage wird direkt in Echtzeit an unser Personal gesendet. Sie werden sich so schnell wie möglich um Sie kümmern.",
  waterRefill: "Wasser Nachfüllen",
  callWaiter: "Kellner Rufen",
  getBill: "Rechnung Bitte",
  extraCutlery: "Zusätzliches Besteck",
  napkins: "Servietten",
  cleanTable: "Tisch Reinigen",
  waterRefillMsg: "Können wir bitte Wasser nachbekommen?",
  callWaiterMsg: "Wir würden gerne mit einem Kellner sprechen",
  getBillMsg: "Können wir bitte die Rechnung bekommen?",
  extraCutleryMsg: "Wir brauchen bitte zusätzliches Besteck",
  napkinsMsg: "Können wir mehr Servietten bekommen?",
  cleanTableMsg: "Könnten Sie bitte unseren Tisch reinigen?",
  menu: "Menü",
  cart: "Warenkorb",
  myOrder: "Meine Bestellung",
  requests: "Anfragen",
};

const zh: Translations = {
  welcome: "欢迎来到 Carta",
  welcomeSubtitle: "数字化用餐体验，尽在指尖",
  seatedAt: "您坐在",
  seats: "个座位",
  table: "桌",
  startOrdering: "开始点餐",
  welcomeFooter: "浏览菜单、下单、随时呼叫服务——全在您的手机上",
  tableNotFound: "未找到餐桌",
  tableNotFoundDesc: "请重新扫描桌上的二维码",
  selectLanguage: "选择语言",
  ourMenu: "我们的菜单",
  menuSubtitle: "新鲜食材，用心烹制 ✨",
  popular: "热门",
  add: "添加",
  added: "已添加",
  noItems: "该分类暂无菜品",
  yourCart: "您的购物车",
  cartEmpty: "购物车为空",
  cartEmptyDesc: "浏览菜单，添加美味菜品",
  browseMenu: "浏览菜单",
  specialInstructions: "添加特殊说明...",
  orderSummary: "订单摘要",
  subtotal: "小计",
  tax: "税费 (8%)",
  total: "合计",
  placeOrder: "提交订单",
  viewCart: "查看购物车",
  orderPlaced: "已下单",
  orderPlacedDesc: "您的订单已收到",
  preparing: "准备中",
  preparingDesc: "厨房正在制作中",
  readyToServe: "准备上菜",
  readyToServeDesc: "您的餐品即将送到！",
  orderReady: "您的订单已准备好！🎉",
  orderInProgress: "订单进行中",
  order: "订单",
  estimatedWait: "预计等待时间",
  waitPlaced: "15–20 分钟",
  waitPreparing: "5–10 分钟",
  orderDetails: "订单详情",
  orderMore: "再点一些",
  needSomething: "需要什么帮助？",
  requestSubtitle: "点击快捷请求或输入您的需求",
  requestSent: "请求已发送！",
  requestSentDesc: "我们的工作人员会尽快为您服务",
  customRequest: "自定义请求",
  typePlaceholder: "在这里输入您的请求...",
  howItWorks: "如何使用",
  howItWorksDesc: "您的请求会实时发送给我们的工作人员，他们会尽快为您服务。",
  waterRefill: "续水",
  callWaiter: "呼叫服务员",
  getBill: "买单",
  extraCutlery: "额外餐具",
  napkins: "纸巾",
  cleanTable: "清洁桌面",
  waterRefillMsg: "请帮我们续水",
  callWaiterMsg: "我们想和服务员说一下",
  getBillMsg: "请帮我们买单",
  extraCutleryMsg: "我们需要额外的餐具",
  napkinsMsg: "请多给些纸巾",
  cleanTableMsg: "请帮我们清洁一下桌面",
  menu: "菜单",
  cart: "购物车",
  myOrder: "我的订单",
  requests: "请求",
};

const ja: Translations = {
  welcome: "Carta へようこそ",
  welcomeSubtitle: "デジタルダイニング体験をお手元に",
  seatedAt: "お席は",
  seats: "席",
  table: "テーブル",
  startOrdering: "注文を始める",
  welcomeFooter: "メニュー閲覧、注文、リクエスト——すべてスマホから",
  tableNotFound: "テーブルが見つかりません",
  tableNotFoundDesc: "テーブルのQRコードを再度スキャンしてください",
  selectLanguage: "言語を選択",
  ourMenu: "メニュー",
  menuSubtitle: "新鮮な食材、心を込めて ✨",
  popular: "人気",
  add: "追加",
  added: "追加済",
  noItems: "このカテゴリーにはアイテムがありません",
  yourCart: "カート",
  cartEmpty: "カートは空です",
  cartEmptyDesc: "メニューを見て美味しい料理を追加しましょう",
  browseMenu: "メニューを見る",
  specialInstructions: "特別な指示を追加...",
  orderSummary: "注文概要",
  subtotal: "小計",
  tax: "税金 (8%)",
  total: "合計",
  placeOrder: "注文する",
  viewCart: "カートを見る",
  orderPlaced: "注文完了",
  orderPlacedDesc: "ご注文を承りました",
  preparing: "調理中",
  preparingDesc: "キッチンで調理中です",
  readyToServe: "提供準備完了",
  readyToServeDesc: "お料理がまもなく届きます！",
  orderReady: "ご注文の準備ができました！🎉",
  orderInProgress: "注文処理中",
  order: "注文",
  estimatedWait: "推定待ち時間",
  waitPlaced: "15〜20分",
  waitPreparing: "5〜10分",
  orderDetails: "注文詳細",
  orderMore: "追加注文",
  needSomething: "何かお困りですか？",
  requestSubtitle: "クイックリクエストまたはメッセージを入力",
  requestSent: "リクエスト送信完了！",
  requestSentDesc: "スタッフがすぐに対応いたします",
  customRequest: "カスタムリクエスト",
  typePlaceholder: "リクエストを入力...",
  howItWorks: "使い方",
  howItWorksDesc: "リクエストはリアルタイムでスタッフに直接送信されます。できるだけ早く対応いたします。",
  waterRefill: "お水おかわり",
  callWaiter: "スタッフを呼ぶ",
  getBill: "お会計",
  extraCutlery: "カトラリー追加",
  napkins: "ナプキン",
  cleanTable: "テーブル清掃",
  waterRefillMsg: "お水のおかわりをお願いします",
  callWaiterMsg: "スタッフの方とお話したいです",
  getBillMsg: "お会計をお願いします",
  extraCutleryMsg: "カトラリーを追加でお願いします",
  napkinsMsg: "ナプキンをもう少しいただけますか？",
  cleanTableMsg: "テーブルを拭いていただけますか？",
  menu: "メニュー",
  cart: "カート",
  myOrder: "注文状況",
  requests: "リクエスト",
};

const ko: Translations = {
  welcome: "Carta에 오신 것을 환영합니다",
  welcomeSubtitle: "손끝에서 시작하는 디지털 다이닝",
  seatedAt: "좌석 위치",
  seats: "인석",
  table: "테이블",
  startOrdering: "주문 시작",
  welcomeFooter: "메뉴 탐색, 주문, 요청 — 모두 휴대폰에서",
  tableNotFound: "테이블을 찾을 수 없습니다",
  tableNotFoundDesc: "테이블의 QR 코드를 다시 스캔해주세요",
  selectLanguage: "언어를 선택하세요",
  ourMenu: "메뉴",
  menuSubtitle: "신선한 재료, 정성을 담아 ✨",
  popular: "인기",
  add: "추가",
  added: "추가됨",
  noItems: "이 카테고리에 항목이 없습니다",
  yourCart: "장바구니",
  cartEmpty: "장바구니가 비어있습니다",
  cartEmptyDesc: "메뉴를 둘러보고 맛있는 요리를 추가해보세요",
  browseMenu: "메뉴 보기",
  specialInstructions: "특별 요청사항 추가...",
  orderSummary: "주문 요약",
  subtotal: "소계",
  tax: "세금 (8%)",
  total: "합계",
  placeOrder: "주문하기",
  viewCart: "장바구니 보기",
  orderPlaced: "주문 완료",
  orderPlacedDesc: "주문이 접수되었습니다",
  preparing: "준비 중",
  preparingDesc: "주방에서 조리 중입니다",
  readyToServe: "서빙 준비 완료",
  readyToServeDesc: "음식이 곧 도착합니다!",
  orderReady: "주문이 준비되었습니다! 🎉",
  orderInProgress: "주문 진행 중",
  order: "주문",
  estimatedWait: "예상 대기 시간",
  waitPlaced: "15–20분",
  waitPreparing: "5–10분",
  orderDetails: "주문 상세",
  orderMore: "추가 주문",
  needSomething: "도움이 필요하신가요?",
  requestSubtitle: "빠른 요청을 탭하거나 메시지를 입력하세요",
  requestSent: "요청이 전송되었습니다!",
  requestSentDesc: "직원이 곧 도와드리겠습니다",
  customRequest: "맞춤 요청",
  typePlaceholder: "요청사항을 입력하세요...",
  howItWorks: "이용 방법",
  howItWorksDesc: "요청은 실시간으로 직원에게 직접 전달됩니다. 가능한 빨리 도와드리겠습니다.",
  waterRefill: "물 리필",
  callWaiter: "직원 호출",
  getBill: "계산서 요청",
  extraCutlery: "추가 수저",
  napkins: "냅킨",
  cleanTable: "테이블 청소",
  waterRefillMsg: "물 리필 부탁드립니다",
  callWaiterMsg: "직원분과 이야기하고 싶습니다",
  getBillMsg: "계산서 부탁드립니다",
  extraCutleryMsg: "수저를 추가로 부탁드립니다",
  napkinsMsg: "냅킨을 더 가져다 주시겠어요?",
  cleanTableMsg: "테이블을 닦아주시겠어요?",
  menu: "메뉴",
  cart: "장바구니",
  myOrder: "내 주문",
  requests: "요청",
};

const ar: Translations = {
  welcome: "مرحباً بكم في Carta",
  welcomeSubtitle: "تجربة طعام رقمية في متناول يدك",
  seatedAt: "أنت جالس في",
  seats: "مقاعد",
  table: "طاولة",
  startOrdering: "ابدأ الطلب",
  welcomeFooter: "تصفح القائمة، اطلب واطلب أي شيء — كل ذلك من هاتفك",
  tableNotFound: "الطاولة غير موجودة",
  tableNotFoundDesc: "يرجى مسح رمز QR على طاولتك مرة أخرى",
  selectLanguage: "اختر لغتك",
  ourMenu: "قائمتنا",
  menuSubtitle: "مكونات طازجة، معدة بحب ✨",
  popular: "شائع",
  add: "إضافة",
  added: "تمت الإضافة",
  noItems: "لا توجد عناصر في هذه الفئة",
  yourCart: "سلة التسوق",
  cartEmpty: "سلتك فارغة",
  cartEmptyDesc: "تصفح القائمة وأضف بعض الأطباق اللذيذة",
  browseMenu: "تصفح القائمة",
  specialInstructions: "أضف تعليمات خاصة...",
  orderSummary: "ملخص الطلب",
  subtotal: "المجموع الفرعي",
  tax: "الضريبة (8%)",
  total: "الإجمالي",
  placeOrder: "تأكيد الطلب",
  viewCart: "عرض السلة",
  orderPlaced: "تم الطلب",
  orderPlacedDesc: "تم استلام طلبك",
  preparing: "قيد التحضير",
  preparingDesc: "المطبخ يعمل على تحضير طلبك",
  readyToServe: "جاهز للتقديم",
  readyToServeDesc: "طعامك في الطريق!",
  orderReady: "طلبك جاهز! 🎉",
  orderInProgress: "الطلب قيد التنفيذ",
  order: "الطلب",
  estimatedWait: "وقت الانتظار المتوقع",
  waitPlaced: "15-20 دقيقة",
  waitPreparing: "5-10 دقائق",
  orderDetails: "تفاصيل الطلب",
  orderMore: "اطلب المزيد",
  needSomething: "تحتاج شيئاً؟",
  requestSubtitle: "اضغط على طلب سريع أو اكتب رسالتك",
  requestSent: "تم إرسال الطلب!",
  requestSentDesc: "سيكون فريقنا معك قريباً",
  customRequest: "طلب مخصص",
  typePlaceholder: "اكتب طلبك هنا...",
  howItWorks: "كيف يعمل",
  howItWorksDesc: "يتم إرسال طلبك مباشرة إلى الموظفين في الوقت الفعلي. سيقومون بخدمتك في أقرب وقت ممكن.",
  waterRefill: "إعادة ملء الماء",
  callWaiter: "استدعاء النادل",
  getBill: "طلب الفاتورة",
  extraCutlery: "أدوات إضافية",
  napkins: "مناديل",
  cleanTable: "تنظيف الطاولة",
  waterRefillMsg: "هل يمكننا الحصول على ماء إضافي من فضلكم؟",
  callWaiterMsg: "نود التحدث مع النادل",
  getBillMsg: "هل يمكننا الحصول على الفاتورة من فضلكم؟",
  extraCutleryMsg: "نحتاج أدوات طعام إضافية من فضلكم",
  napkinsMsg: "هل يمكننا الحصول على المزيد من المناديل؟",
  cleanTableMsg: "هل يمكنكم تنظيف طاولتنا من فضلكم؟",
  menu: "القائمة",
  cart: "السلة",
  myOrder: "طلبي",
  requests: "الطلبات",
};

// ── Translation map ─────────────────────────────────────────

export const translations: Record<Locale, Translations> = {
  en,
  es,
  fr,
  de,
  zh,
  ja,
  ko,
  ar,
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? en;
}
