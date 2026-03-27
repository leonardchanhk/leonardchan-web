-- Seed: Site Settings
INSERT OR IGNORE INTO site_settings (key, value, description) VALUES
  ('site_title', 'Leonard Chan, MH', 'Site title'),
  ('site_tagline_en', 'Technology Innovator · Policy Advocate · Digital Architect', 'Hero tagline EN'),
  ('site_tagline_tc', '科技創新者 · 政策倡議者 · 數字建築師', 'Hero tagline TC'),
  ('site_tagline_sc', '科技创新者 · 政策倡议者 · 数字建筑师', 'Hero tagline SC'),
  ('announcement_banner', '', 'Homepage announcement banner (leave empty to hide)'),
  ('otp_enabled', 'true', 'Site-wide OTP toggle'),
  ('otp_whitelist_enabled', 'true', 'Enforce email whitelist for admin login'),
  ('seo_site_title', 'Leonard Chan, MH — Technology Innovator & Policy Advocate', 'SEO title'),
  ('seo_site_description', 'Official website of Leonard Chan, MH. AI governance expert, cybersecurity thought leader, HKIRC Deputy Chairman, AIRDI Board Member, and Hong Kong ICT pioneer with 30+ years of experience.', 'SEO description'),
  ('contact_email', 'leonard@tag.digital', 'Contact form recipient email'),
  ('social_linkedin', 'https://linkedin.com/in/leonardchan', 'LinkedIn URL'),
  ('social_facebook', 'https://facebook.com/drchan', 'Facebook URL'),
  ('hero_badge', 'Medal of Honour · HKSAR 2025', 'Hero badge text');

-- Seed: Email whitelist (Leonard's admin email)
INSERT OR IGNORE INTO email_whitelist (email, added_by) VALUES
  ('leonard@tag.digital', 'system');

-- Seed: Organisations
INSERT OR IGNORE INTO organisations (slug, name_en, name_tc, name_sc, role_en, role_tc, role_sc, website_url, category, sort_order, published) VALUES
  ('tag-digital', 'tag.digital', 'tag.digital', 'tag.digital', 'Founder & CEO', '創辦人及行政總裁', '创办人及行政总裁', 'https://tag.digital', 'company', 1, 1),
  ('airdi', 'Artificial Intelligence Research and Development Institute (AIRDI)', '人工智能研究及發展局 (AIRDI)', '人工智能研究及发展局 (AIRDI)', 'Board Member', '董事局成員', '董事局成员', 'https://airdi.hk', 'advisory', 2, 1),
  ('hkirc', 'Hong Kong Internet Registration Corporation (HKIRC)', '香港互聯網註冊管理有限公司 (HKIRC)', '香港互联网注册管理有限公司 (HKIRC)', 'Deputy Chairman', '副主席', '副主席', 'https://hkirc.hk', 'advisory', 3, 1),
  ('tia', 'Technology Industry Alliance (TIA)', '科技業聯盟 (TIA)', '科技业联盟 (TIA)', 'Chairman', '主席', '主席', '', 'advisory', 4, 1),
  ('hkitda', 'Hong Kong IT Directors Association (HKITDA)', '香港資訊科技總監協會 (HKITDA)', '香港资讯科技总监协会 (HKITDA)', 'Past President', '前會長', '前会长', 'https://hkitda.org.hk', 'advisory', 5, 1),
  ('lingnan', 'Lingnan University', '嶺南大學', '岭南大学', 'Court Member', '校董會成員', '校董会成员', 'https://ln.edu.hk', 'academic', 6, 1),
  ('cuc', 'Communication University of China (CUC)', '中國傳媒大學 (CUC)', '中国传媒大学 (CUC)', 'Adjunct Professor', '客座教授', '客座教授', 'https://cuc.edu.cn', 'academic', 7, 1),
  ('rotary', 'Rotary Club of Hong Kong East', '香港東區扶輪社', '香港东区扶轮社', 'Member', '會員', '会员', '', 'community', 8, 1);

-- Seed: Articles
INSERT OR IGNORE INTO articles (slug, title_en, title_tc, excerpt_en, excerpt_tc, category, external_url, published, featured, published_at) VALUES
  ('hk-five-year-plan-2026', 'Hong Kong''s Five-Year Plan: A Digital Blueprint', '香港五年規劃：數字藍圖', 'An analysis of how Hong Kong''s five-year development plan positions the city as a global digital hub.', '分析香港五年發展規劃如何將城市定位為全球數字樞紐。', 'policy', 'https://epaper.tkww.hk', 1, 1, '2026-03-18'),
  ('sha-ling-data-park', 'Sha Ling Data Park: The Engine of Hong Kong''s AI Future', '沙嶺數據園：香港AI未來的引擎', 'How the Sha Ling Data Park will transform Hong Kong into a leading AI and data economy in the GBA.', '沙嶺數據園將如何把香港轉變為大灣區領先的AI和數據經濟體。', 'technology', 'https://www.tkww.hk', 1, 1, '2026-03-10'),
  ('budget-2026-digital', '2026-27 Budget: A Digital Economy Perspective', '2026-27財政預算案：數字經濟視角', 'Leonard Chan''s response to the 2026-27 Budget from the perspective of Hong Kong''s digital economy and ICT sector.', '陳迪源從香港數字經濟及資訊科技業角度回應2026-27財政預算案。', 'policy', 'https://www.capital-hk.com', 1, 0, '2026-02-26'),
  ('ai-safety-competitiveness', 'AI Safety and Competitiveness: Hong Kong''s Unique Advantage', 'AI安全與競爭力：香港的獨特優勢', 'Why Hong Kong''s regulatory environment positions it as the ideal hub for responsible AI development.', '為何香港的監管環境使其成為負責任AI發展的理想樞紐。', 'ai-governance', 'https://www.capital-hk.com', 1, 1, '2026-01-15'),
  ('physical-ai-real-economy', 'Physical AI and the Real Economy: New Industrialisation', '實體AI與實體經濟：新型工業化', 'How the convergence of physical AI with manufacturing and logistics is reshaping Hong Kong''s industrial base.', '實體AI與製造業及物流業的融合如何重塑香港的工業基礎。', 'ai-governance', 'https://www.capital-hk.com', 1, 0, '2025-12-10'),
  ('gba-super-connector', 'GBA Integration: Hong Kong as the Super Connector', '大灣區融合：香港作為超級聯繫人', 'Leonard Chan on how Hong Kong can leverage its unique position to bridge international markets with the Greater Bay Area.', '陳迪源論香港如何利用其獨特地位，連接國際市場與大灣區。', 'gba', 'https://www.capital-hk.com', 1, 0, '2025-11-20');

-- Seed: Projects
INSERT OR IGNORE INTO projects (slug, title_en, title_tc, description_en, description_tc, category, url, sort_order, published) VALUES
  ('tag-digital', 'tag.digital', 'tag.digital', 'A leading digital transformation consultancy and technology company in Hong Kong, providing AI strategy, cybersecurity, and digital innovation services.', '香港領先的數字轉型顧問及科技公司，提供AI策略、網絡安全及數字創新服務。', 'company', 'https://tag.digital', 1, 1),
  ('airdi-framework', 'AIRDI AI Governance Framework', 'AIRDI人工智能治理框架', 'Contributing to Hong Kong''s national AI governance framework as a Board Member of the Artificial Intelligence Research and Development Institute.', '作為人工智能研究及發展局董事局成員，為香港國家AI治理框架作出貢獻。', 'governance', '', 2, 1),
  ('hkitda-advocacy', 'HKITDA Digital Policy Advocacy', 'HKITDA數字政策倡議', 'Leading industry advocacy for Hong Kong''s ICT sector as Past President of the Hong Kong IT Directors Association.', '作為香港資訊科技總監協會前會長，領導香港資訊科技業的行業倡議工作。', 'advocacy', 'https://hkitda.org.hk', 3, 1),
  ('award-judging-system', 'HK ICT Awards Judging System', '香港ICT大獎評審系統', 'Designed and built the cloud-based real-time scoring and judging system for the Hong Kong ICT Awards, now adopted by over 100 award programmes locally and internationally.', '設計並建立香港ICT大獎的雲端實時評分及評審系統，現已被本地及國際逾100個獎項計劃採用。', 'technology', '', 4, 1),
  ('embroidery-patent', 'US Patent: Embroidery CAD/CAM System', '美國專利：刺繡CAD/CAM系統', 'Invented a method for converting traditional embroidery data tapes into scalable digital CAD/CAM formats — one of Hong Kong''s earliest technology patents in industrial automation.', '發明了一種將傳統刺繡數據帶轉換為可擴展數字CAD/CAM格式的方法，是香港最早的工業自動化技術專利之一。', 'innovation', '', 5, 1),
  ('project-prove', 'Project Prove', 'Project Prove', 'A landmark initiative demonstrating the viability of digital identity and provenance verification in Hong Kong''s technology ecosystem.', '一項具里程碑意義的計劃，展示了數字身份及來源驗證在香港科技生態系統中的可行性。', 'innovation', '', 6, 1),
  ('un-world-summit', 'UN World Summit Award — m-Media & News', '聯合國世界峰會獎 — 移動媒體及新聞', 'Won the United Nations World Summit Award in the m-Media & News category at the ceremony in Vienna — one of the world''s most prestigious digital innovation honours.', '在維也納頒獎典禮上榮獲聯合國世界峰會獎移動媒體及新聞類別獎項，是全球最具聲望的數字創新榮譽之一。', 'award', '', 7, 1);
