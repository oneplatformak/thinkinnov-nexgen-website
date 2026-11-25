/**
 * Japanese strings for the bilingual site.
 * Body copy is included only when it already exists in staging
 * (pageContentJp or the JP dictionary). UI chrome (navigation,
 * buttons, form labels, aria) is translated separately and marked ui.
 * Anything not listed here stays English.
 */
const pairs = {
  // —— staging dictionary (labels + existing sentences) ——
  "About Us": "会社概要",
  "About us": "会社概要",
  "PLM For Everyone": "すべての人のためのPLM",
  "Services": "サービス",
  "Digital Transformation": "デジタルトランスフォーメーション",
  "Products": "製品",
  "Solutions": "ソリューション",
  "Industries": "業界",
  "Behind the Brand": "ブランドの裏側",
  "Careers": "採用情報",
  "Contact us": "お問い合わせ",
  "Contact Us": "お問い合わせ",
  "Contact": "お問い合わせ",
  "Know More": "詳しく見る",
  "Know more": "詳しく見る",
  "Explore Our Solutions": "ソリューション一覧",
  "Explore our solutions": "ソリューション一覧",
  "Explore solutions": "ソリューションを見る",
  "Executive Leadership": "経営陣",
  "Gallery Media": "ギャラリー",
  "Gallery": "ギャラリー",
  "Captured Moments": "ギャラリー",
  "Company Profile": "会社概要",
  "Join the Dream Team": "ドリームチームに参加",
  "Join the dream team": "ドリームチームに参加",
  "Join the Team": "チームに参加",
  "Who We Are": "私たちについて",
  "Vision, Mission and Values": "ビジョン・ミッション・価値観",
  "Vision & Values": "ビジョンと価値観",
  "Problem We Solve": "私たちが解決する課題",
  "Problem we solve": "私たちが解決する課題",
  "Problems we solve": "私たちが解決する課題",
  "Our Team": "チーム",
  "Our team": "チーム",
  "Ready to create your own journey?": "あなたらしいキャリアを始めませんか？",
  "Current Opportunity Areas": "募集領域",
  "REGISTER HERE": "登録する",
  "Register here": "登録する",
  "Can't find what you're looking for?": "お探しの職種が見つかりませんか？",
  "Company Name": "会社名",
  "President/CEO": "代表取締役CEO",
  "Managing Director": "マネージングディレクター",
  "Director - CEO": "取締役 CEO",
  "Executive Director": "エグゼクティブディレクター",
  "Head Office": "本社",
  "Branch Office": "支社",
  "Branch offices": "支社",
  "View Map": "地図を見る",
  "View map": "地図を見る",
  "View on Google Maps": "地図を見る",
  "Map": "地図",
  "Design Data Management": "設計データ管理",
  "3D Shape Search": "3D形状検索",
  "Quality Management Solution": "品質管理ソリューション",
  "Quality Issue Management Solution": "品質課題管理ソリューション",
  "Quality Issue Management": "品質課題管理",
  "Design Verification Management": "設計検証管理",
  "Engineering Change Management Solution": "設計変更管理ソリューション",
  "Engineering Change Management": "設計変更管理",
  "Requirements Management Solution": "要件管理ソリューション",
  "Requirements Management": "要件管理",
  "Mendix | Low-Code Application Development Platform": "Mendix | ローコードアプリケーション開発基盤",
  "Digital Factory/Enterprise": "デジタルファクトリー / エンタープライズ",
  "Digital Factory / Enterprise": "デジタルファクトリー / エンタープライズ",
  "Project Management Solution": "プロジェクト管理ソリューション",
  "Active Integration Solution": "アクティブ統合ソリューション",
  "Teamcenter Gateway for SAP Business Suite": "Teamcenter Gateway for SAP Business Suite",
  "Teamcenter Gateway for Oracle E-Business Suite": "Teamcenter Gateway for Oracle E-Business Suite",
  "NX programming and customization": "NXプログラミングとカスタマイズ",
  "Simulation process and data management": "シミュレーションプロセス・データ管理",
  "Pre-Implementation": "導入前",
  "Implementation": "導入",
  "Post-Implementation": "導入後",
  "Consulting": "コンサルティング",
  "Sales": "営業",
  "State-Of-Art": "先進サービス",
  "State of the art": "先進サービス",
  "Development": "開発",
  "Performance Optimization": "性能最適化",
  "Performance optimization": "性能最適化",
  "Infrastructure Management": "インフラ管理",
  "Infrastructure management": "インフラ管理",
  "Sustaining Service": "継続サービス",
  "Sustaining service": "継続サービス",
  "Support": "サポート",
  "Enhancements": "機能強化",
  "Unlocking the Potential": "可能性を引き出す",
  "Maximizing Efficiency": "効率の最大化",
  "Duplication Concerns": "重複への対応",
  "Navigating Uncertainty": "不確実性への対応",
  "Meet Our Team": "チーム紹介",
  "A software development service provider since 2014, focused on turning inspiration into practical digital solutions.": "2014年創業のソフトウェア開発サービス企業として、着想を実用的なデジタルソリューションへ変えています。",
  "ThinkInnov-NexGen helps customers progress to the next level of product design innovation, manufacturing efficiency and performance.": "ThinkInnov-NexGenは、製品設計の革新、製造効率、パフォーマンスを次の段階へ進める支援をします。",
  "Industry-specific PLM solutions tailored to accelerate innovation and digital transformation.": "イノベーションとデジタル変革を加速する、業界別PLMソリューションです。",
  "Create your own journey in an environment designed to be meaningful, rewarding and enriching.": "意義と成長を感じられる環境で、あなた自身のキャリアを築きましょう。",
  "Product Lifecycle Management": "製品ライフサイクル管理",
  "Collect, analyse and visualize data and processes throughout the product lifecycle.": "製品ライフサイクル全体のデータとプロセスを収集・分析・可視化します。",
  "Create closed-loop analytics from development to manufacturing to real-world feedback and then back to design.": "開発、製造、実使用フィードバック、設計改善までをつなぐクローズドループ分析を実現します。",
  "Collect, analyse and visualize data and processes throughout the product lifecycle. Create closed-loop analytics from development to manufacturing to real-world feedback and then back to design.": "製品ライフサイクル全体のデータとプロセスを収集・分析・可視化します。開発、製造、実使用フィードバック、設計改善までをつなぐクローズドループ分析を実現します。",
  "PLM your way": "最適なPLM導入",
  "Get Teamcenter delivered any way you want it – on premises or on the cloud – operated by your IT team or Siemens.": "オンプレミス、クラウド、自社運用、Siemens運用など、必要な形でTeamcenterを導入できます。",
  "End-to-end PLM solutions for consulting, mapping, implementation and adoption.": "コンサルティング、マッピング、導入、定着までを支援するエンドツーエンドPLMソリューションです。",
  "End-to-end PLM solutions for consulting, mapping, implementation and adoption": "コンサルティング、マッピング、導入、定着までを支援するエンドツーエンドPLMソリューションです。",
  "ThinkInnov-NexGen combines PLM domain expertise, technical delivery and a consultative approach to help companies build a practical digital thread across product development.": "ThinkInnov-NexGenはPLM領域の知見、技術提供力、コンサルティング型アプローチを組み合わせ、製品開発全体に実用的なデジタルスレッドを構築します。",
  "On premises": "オンプレミス",
  "On cloud": "クラウド",
  "On cloud, SaaS by Siemens": "Siemens SaaSクラウド",
  "Host, manage and support your PLM software with your IT team.": "自社ITチームでPLMソフトウェアをホスト、管理、サポートできます。",
  "Choose your cloud provider, managed by your IT team.": "クラウドプロバイダーを選択し、自社ITチームで管理できます。",
  "Get started quickly using software as a service. Operation, maintenance and upgrades are included.": "SaaSとして素早く開始でき、運用、保守、アップグレードも含まれます。",
  "Our Catalogue of Products": "製品カタログ",
  "Our catalogue of products": "製品カタログ",
  "Catalogue of products": "製品カタログ",
  "Core Siemens solutions for design, lifecycle management, manufacturing automation and low-code development.": "設計、ライフサイクル管理、製造自動化、ローコード開発に対応するSiemens主要ソリューションです。",
  "Focused PLM and engineering solutions for product data, quality, change, integration and digital manufacturing.": "製品データ、品質、変更、統合、デジタル製造に対応するPLM・エンジニアリングソリューションです。",
  "Our Key Customers": "主要顧客",
  "Our key customers": "主要顧客",
  "Trusted by product-led teams across automotive, aerospace, energy, electrical and manufacturing industries.": "自動車、航空宇宙、エネルギー、電気、製造業のお客様に信頼されています。",
  "We're here to help and answer any questions you might have.": "ご質問やご相談にお応えします。",
  "We look forward to hearing from you!": "お問い合わせをお待ちしています。",
  "We look forward to hearing from you.": "お問い合わせをお待ちしています。",
  "We're here to help and answer any questions you might have. We look forward to hearing from you.": "ご質問やご相談にお応えします。お問い合わせをお待ちしています。",
  "Name *": "お名前 *",
  "Email *": "メール *",
  "Message *": "メッセージ *",
  "Send Message": "送信",
  "Send message": "送信",
  "Quick Links": "クイックリンク",
  "Explore Us": "サイトメニュー",
  "Explore": "サイトメニュー",
  "Locate Us": "所在地",
  "What Our Clients Say": "お客様の声",
  "What our clients say": "お客様の声",
  "Apply for job": "求人に応募",
  "Apply for a job": "求人に応募",
  "Apply for a role": "求人に応募",
  "First Name *": "名 *",
  "First name *": "名 *",
  "Last Name *": "姓 *",
  "Last name *": "姓 *",
  "Contact Number *": "電話番号 *",
  "Contact number *": "電話番号 *",
  "Year of Graduation *": "卒業年 *",
  "Year of graduation *": "卒業年 *",
  "Select your gender *": "性別を選択 *",
  "Overall Experience in Years *": "総経験年数 *",
  "Overall experience (years) *": "総経験年数 *",
  "Current Employer *": "現在の勤務先 *",
  "Current employer *": "現在の勤務先 *",
  "Current CTC (in LPA) *": "現在の年収（LPA）*",
  "Current CTC (LPA) *": "現在の年収（LPA）*",
  "Expected CTC (in LPA) *": "希望年収（LPA）*",
  "Expected CTC (LPA) *": "希望年収（LPA）*",
  "Notice Period (in Days) *": "通知期間（日数）*",
  "Notice period (days) *": "通知期間（日数）*",
  "Skill Set *": "スキルセット *",
  "Skill set *": "スキルセット *",
  "How did you come across this vacancy? *": "この求人をどこで知りましたか？ *",
  "How did you find this vacancy? *": "この求人をどこで知りましたか？ *",
  "Current Location *": "現在地 *",
  "Current location *": "現在地 *",
  "Preferred Location *": "希望勤務地 *",
  "Preferred location *": "希望勤務地 *",
  "Choose File *": "ファイルを選択 *",
  "Apply Now": "今すぐ応募",
  "Apply now": "今すぐ応募",
  "Key Responsibilities": "主な責任",
  "Key responsibilities": "主な責任",
  "Required Skills": "必要スキル",
  "Required skills": "必要スキル",
  "Job Information": "求人情報",
  "Job information": "求人情報",
  "Location:": "勤務地:",
  "Location": "勤務地",
  "Experience:": "経験:",
  "Experience": "経験",
  "I'm Interested": "応募する",
  "Share Job via Email": "メールで共有",
  "Share via email": "メールで共有",
  "Apply": "応募",
  "Siemens Solution Partner": "Siemensソリューションパートナー",
  "Siemens partner": "Siemensパートナー",
  "Your partners for innovation digital transformation solutions.": "イノベーションとDXソリューションのパートナーです。",
  "Your partner for innovation and digital transformation": "イノベーションと{{br}}DXソリューションの{{br}}パートナーです。",
  "As experts in specific industries, innovative digital technologies and systems, we reliably meet your requirements using Siemens product and system portfolios.": "特定業界、革新的なデジタル技術、システムの専門家として、Siemens製品・システムポートフォリオを活用し、お客様の要件に確実に応えます。",
  "The future is co-created": "未来は共創でつくられる",
  "Connect PLM, ERP, MES and product knowledge into one practical digital foundation.": "PLM、ERP、MES、製品知識を実用的なデジタル基盤につなぎます。",
  "Enable customers to innovate more and faster.": "お客様のイノベーションをより速く、より大きくします。",
  "Reuse product lifecycle knowledge through innovative digital solutions that improve design, manufacturing and decision-making.": "革新的なデジタルソリューションで製品ライフサイクルの知識を再活用し、設計、製造、意思決定を改善します。",
  "On premises, cloud or SaaS delivery aligned to your operating model.": "オンプレミス、クラウド、SaaSをお客様の運用モデルに合わせて提供します。",
  "Low code no code platform": "ローコード・ノーコード基盤",
  "Mendix accelerates scalable business applications.": "Mendixは拡張性のある業務アプリ開発を加速します。",
  "Build, integrate and deploy applications rapidly while improving collaboration and agility in a dynamic digital landscape.": "変化の速いデジタル環境で、協業と俊敏性を高めながらアプリケーションを迅速に構築・統合・展開します。",
  "Move faster from idea to usable application with enterprise-ready low-code delivery.": "エンタープライズ対応のローコード提供により、アイデアから使えるアプリまでを素早く進めます。",
  "Customer feedback from PLM upgrades, implementation pace and long-term support.": "PLMアップグレード、導入スピード、長期サポートに関するお客様の声です。",
  "Congratulations on the successful Teamcenter upgrade! Your team's dedication and collaboration, especially the impressive work of the Young Guns, have been exceptional.": "Teamcenterアップグレードの成功、おめでとうございます。皆様の献身と協力、特に若手メンバーの素晴らしい働きは非常に印象的でした。",
  "We're thrilled with the successful Teamcenter upgrade and the incredible support provided by your team. Their dedication, professionalism, and teamwork made all the difference.": "Teamcenterアップグレードの成功と、貴社チームの素晴らしいサポートに大変満足しています。献身、専門性、チームワークが大きな違いを生みました。",
  "We just Thinkin(g) No(w) that we have found a great vendor to support us on our needs. Your team deliveries are commendable.": "私たちのニーズを支援してくれる優れたベンダーに出会えたと感じています。貴社チームの提供品質は高く評価できます。",
  "I am thrilled at the pace of implementation and that the system is up and running and the teams are using it.": "導入スピードに大変満足しています。システムは稼働し、チームも活用しています。",
  "SWARAJ": "SWARAJ",
  "EXIDE ENERGY": "EXIDE ENERGY",
  "Ohmium": "Ohmium",
  "KISLAY PANKAJ": "KISLAY PANKAJ",
  "CEO - LECTRIX": "CEO - LECTRIX",

  // —— pageContentJp section copy that matches current English ——
  "ThinkInnov-NexGen is a next-generation IT services company helping businesses solve complex problems with modern cloud, IoT, AI and digital talent. The organization focuses on accelerating digital transformation with practical, human-centered technology delivery.": "ThinkInnov-NexGenは、クラウド、IoT、AI、デジタル人材を活用し、企業の複雑な課題解決を支援する次世代ITサービス企業です。",
  "What is ThinkInnov-NexGen?": "ThinkInnov-NexGenとは",
  "A global software development services provider serving customers since 2014.": "2014年からお客様を支援しているグローバルなソフトウェア開発サービス企業です。",
  "Operating Philosophy": "事業姿勢",
  "Create meaningful solutions from inspiration, with disciplined engineering and a customer-first delivery model.": "着想を価値あるソリューションに変え、規律あるエンジニアリングと顧客第一の提供体制で実行します。",
  "Global Presence": "グローバル拠点",
  "Japan headquarters with India delivery presence across Chennai and Coimbatore.": "日本本社と、チェンナイ・コインバトールのインドデリバリー拠点を持ちます。",
  "Vision": "ビジョン",
  "To become a pioneer in next-generation IT services and solutions, empowering individuals and organizations to lead change.": "次世代ITサービスとソリューションの先駆者となり、個人と組織が変革をリードできるよう支援します。",
  "Mission": "ミッション",
  "To deliver effective IT services and solutions based on professional experience, best practices, global expertise and advanced technologies.": "専門経験、ベストプラクティス、グローバル知見、先進技術に基づく効果的なITサービスを提供します。",
  "Values": "価値観",
  "Head, Heart and Hand: wisdom, passion and execution. ThinkInnov-NexGen believes in giving back to customers, teams and society.": "Head, Heart and Hand。知恵、情熱、実行力を大切にし、お客様、チーム、社会へ価値を還元します。",
  "A closer look at the spaces, collaborations and delivery culture behind the ThinkInnov-NexGen team.": "ThinkInnov-NexGenチームの空間、協業、デリバリー文化を感じられるギャラリーです。",
  "ThinkInnov-NexGen is led by a hands-on leadership team focused on strategy, delivery quality and global growth.": "戦略、品質、グローバル成長を推進する実践型のリーダーシップチームです。",
  "Key ThinkInnov-NexGen details for leadership, headquarters and branch offices.": "ThinkInnov-NexGen Corporationのリーダー、本社、支社情報です。",
  "15th Floor, Harumi Prime Square, 2-1-40 Harumi, Chuo-ku, Tokyo 104-0053, Japan": "104-0053 東京都中央区晴海2丁目1-40 晴海プライムスクエア15階",
  "Nagaoka - Japan": "長岡 - 日本",
  "Coimbatore - India": "コインバトール - インド",
  "Chennai - India": "チェンナイ - インド",
  "We know that finding a meaningful and rewarding career can be a long journey. Our goal is to make that process easy for you and to create a work environment that's enriching — one that you'll look forward to every day.": "やりがいのあるキャリア探しは長い道のりです。私たちは、そのプロセスを分かりやすくし、毎日働くことが楽しみになる豊かな環境づくりを目指しています。",
  "From startup to enterprise, ThinkInnov-NexGen guides teams to the right software solution, manages implementation and supports adoption.": "スタートアップから大企業まで、最適なソフトウェア選定、導入、トレーニング、継続支援を提供します。",
  "From startup to enterprise — we guide you to the right software solution, manage implementation, and provide training and ongoing support (sustenance) so you get the best value from your investment.": "スタートアップから大企業まで、最適なソフトウェア選定、導入、トレーニング、継続支援を提供します。",
  "Consulting to Adoption": "コンサルティングから定着まで",
  "Engineering Outcomes": "エンジニアリング成果",
  "Industry PLM": "業界別PLM",
  "PLM industry focus": "業界別PLMフォーカス",
  "People and Stories": "人とストーリー",
  "The people, problem-solving approach and delivery culture behind ThinkInnov-NexGen.": "ThinkInnov-NexGenの人、課題解決アプローチ、デリバリー文化を紹介します。",

  // —— UI chrome only (navigation, controls, form labels). Not business claims. ——
  "Home": "ホーム",
  "ThinkInnov-NexGen home": "ThinkInnov-NexGen ホーム",
  "Skip to content": "本文へスキップ",
  "Open menu": "メニューを開く",
  "Close menu": "メニューを閉じる",
  "Company": "企業情報",
  "Offerings": "提供内容",
  "Language": "言語",
  "Main": "メイン",
  "Mobile": "モバイル",
  "Breadcrumb": "パンくず",
  "On this page": "このページ",
  "Focus areas": "注力領域",
  "Pause rotation": "ローテーションを一時停止",
  "Play rotation": "ローテーションを再生",
  "Innovate faster": "より速く革新",
  "Previous image": "前の画像",
  "Next image": "次の画像",
  "Close lightbox": "ライトボックスを閉じる",
  "Our key customers": "主要顧客",
  "Full services overview": "サービス詳細",
  "All solutions": "すべてのソリューション",
  "Industry focus": "業界フォーカス",
  "View infographic": "インフォグラフィックを見る",
  "View careers": "採用情報を見る",
  "All roles": "すべての職種",
  "Open role": "募集職種",
  "Next step": "次のステップ",
  "Partnership": "パートナーシップ",
  "Leadership": "経営陣",
  "Benefits": "メリット",
  "Business size": "企業規模",
  "NPD process": "新製品開発",
  "Why us": "選ばれる理由",
  "Get in touch": "お問い合わせ",
  "Tokyo headquarters": "東京本社",
  "Page not found": "ページが見つかりません",
  "The page you requested is not available. Try one of these destinations.": "ご指定のページは見つかりません。以下のページからお探しください。",
  "The requested page could not be found.": "ご指定のページは見つかりません。",
  "Company": "企業情報",
  "Phone": "電話",
  "Company": "企業情報",
  "I agree to be contacted about my enquiry. See our privacy practices on request.": "お問い合わせ内容について連絡を受けることに同意します。プライバシーの取り扱いはご依頼に応じてご案内します。",
  "I consent to ThinkInnov-NexGen processing my application data for recruitment purposes.": "採用選考のため、ThinkInnov-NexGenが応募情報を取り扱うことに同意します。",
  "Gender *": "性別 *",
  "Male": "男性",
  "Female": "女性",
  "Prefer not to say": "回答しない",
  "Select *": "選択 *",
  "Referral": "紹介",
  "Website": "ウェブサイト",
  "Other": "その他",
  "Role of interest": "希望職種",
  "General application": "一般応募",
  "CV / resume (PDF, DOC, DOCX — max 5 MB) *": "履歴書・職務経歴書（PDF、DOC、DOCX — 最大5MB）*",
  "Services lifecycle": "サービスの流れ",
  "Please complete the required fields.": "必須項目を入力してください。",
  "Sending…": "送信しています…",
  "Thank you — your message was sent.": "送信しました。",
  "Thank you — your application was sent.": "応募を受け付けました。",
  "We could not reach the mail server from this preview. You can still send via email:": "このプレビューではメールサーバーに接続できません。メールアプリから送信できます。",
  "open your email app": "メールアプリを開く",
  "Redirecting": "移動しています",
  "Redirecting… If nothing happens,": "移動しています。自動で開かない場合は、",
  "continue here": "こちらへ進む",
};

// Nav group is "Company" → 企業情報. The contact field label is "Company name".
pairs["Company name"] = "会社名";

const dict = pairs;

function lookup(text) {
  if (text == null) return null;
  const trimmed = String(text).trim();
  if (!trimmed || !Object.prototype.hasOwnProperty.call(dict, trimmed)) return null;
  return dict[trimmed];
}

function decode(s) {
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function encode(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function special(trimmed) {
  let match = trimmed.match(/^ThinkInnov-NexGen gallery photo (\d+)$/);
  if (match) return `ThinkInnov-NexGen ギャラリー写真 ${match[1]}`;
  match = trimmed.match(/^Open gallery image (\d+)$/);
  if (match) return `ギャラリー画像 ${match[1]} を開く`;
  match = trimmed.match(/^(.+) infographic$/);
  if (match) return `${lookup(match[1]) || match[1]}のインフォグラフィック`;
  return null;
}

function replaceExact(raw) {
  const leading = raw.match(/^\s*/)[0];
  const trailing = raw.match(/\s*$/)[0];
  const trimmed = decode(raw.trim());
  if (!trimmed) return null;
  const patterned = special(trimmed);
  if (patterned) return leading + encode(patterned) + trailing;
  if (Object.prototype.hasOwnProperty.call(dict, trimmed)) {
    return leading + encode(dict[trimmed]).replace(/\{\{br\}\}/g, "<br>") + trailing;
  }
  const wrapped = trimmed.match(/^([“"「])([\s\S]+)([”"」])$/);
  if (wrapped && Object.prototype.hasOwnProperty.call(dict, wrapped[2])) {
    return leading + encode(wrapped[1] + dict[wrapped[2]] + wrapped[3]) + trailing;
  }
  return null;
}

const misses = [];

function apply(html, pageRel) {
  const scripts = [];
  let masked = html.replace(/<script\b[\s\S]*?<\/script>/gi, (block) => {
    scripts.push(block);
    return `%%SCRIPT${scripts.length - 1}%%`;
  });

  masked = masked.replace(/>([^<]+)</g, (full, text) => {
    const next = replaceExact(text);
    if (next != null) return `>${next}<`;
    note(text, pageRel, "text");
    return full;
  });

  masked = masked.replace(/\b(aria-label|alt|placeholder)="([^"]*)"/g, (full, attr, value) => {
    const decoded = decode(value);
    const patterned = special(decoded);
    const next = patterned || lookup(decoded);
    if (next != null) return `${attr}="${next}"`;
    if (attr === "alt" && (/ logo$/.test(value) || value.trim() === "")) return full;
    if (attr !== "alt" || value.trim()) note(value, pageRel, attr);
    return full;
  });

  masked = masked.replace(/<title>([^<]*)<\/title>/gi, (full, title) => {
    const translated = title
      .split(" | ")
      .map((part) => lookup(part) || part)
      .join(" | ");
    return `<title>${translated}</title>`;
  });

  masked = masked.replace(
    /(<meta\b[^>]*(?:property="og:title"|name="twitter:title")[^>]*\bcontent=")([^"]*)(")/gi,
    (full, pre, title, post) => {
      const translated = title
        .split(" | ")
        .map((part) => lookup(part) || part)
        .join(" | ");
      return pre + translated + post;
    }
  );

  scripts.forEach((block, i) => {
    masked = masked.replace(`%%SCRIPT${i}%%`, block);
  });
  return masked;
}

function note(raw, pageRel, kind) {
  const trimmed = decode(String(raw || "").replace(/\s+/g, " ").trim());
  if (trimmed.length < 24) return;
  if (trimmed.includes(" | ") || trimmed.startsWith("©")) return;
  if (!/[A-Za-z]{4,}/.test(trimmed)) return;
  if (/^https?:/i.test(trimmed) || trimmed.includes("@")) return;
  misses.push({ page: pageRel || "", kind, text: trimmed });
}

function report() {
  const seen = new Set();
  const rows = [];
  misses.forEach((row) => {
    const key = `${row.text}`;
    if (seen.has(key)) return;
    seen.add(key);
    rows.push(row);
  });
  rows.sort((a, b) => a.text.localeCompare(b.text));
  return rows;
}

function resetReport() {
  misses.length = 0;
}

module.exports = { dict, lookup, apply, report, resetReport };
