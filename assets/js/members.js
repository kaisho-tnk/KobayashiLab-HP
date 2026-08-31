/* ============================================================
   Members ページ / ホームプレビュー 共通スクリプト
   ・members.html 本体（Faculty / Students / Staff / Alumni）の描画
   ・index.html の Members プレビュー（アバター一覧）の描画
   データは data/members.js を参照。通常編集は不要。
   ============================================================ */
(function () {
  'use strict';

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // 現在の表示言語。site.js が window.getSiteLang を公開している前提（無ければ日本語扱い）
  function lang() {
    return window.getSiteLang ? window.getSiteLang() : 'ja';
  }

  // m[field] と m[field+'En'] のうち、現在の言語に応じた方を返す。
  // 英語版が未入力（空文字・未設定）なら、日本語版にフォールバックする。
  function T(m, field) {
    if (lang() === 'en') {
      var en = m[field + 'En'];
      if (en) return en;
    }
    return m[field] || '';
  }

  /* ---------- status の解釈 ---------- */
  var FACULTY_STATUSES = [
    'Professor', 'Associate Professor', 'Project Associate Professor',
    'Assistant Professor', 'Project Assistant Professor'
  ];
  var STAFF_STATUSES = [
    'Teaching Assistant', 'Postdoctoral Researcher', 'Special Assistant Teacher',
    'Academic Support Staff', 'R&D Staff', 'Secretary'
  ];
  var ALUMNI_STATUSES = ['OB', 'OG'];
  // Studentsの並び順の基準（上位学年から）
  var STUDENT_GRADE_ORDER = ['D3', 'D2', 'D1', 'M2', 'M1', 'B4', 'B3', 'B2', 'B1'];
  var GRADE_LABELS_JA = {
    D1: '博士課程 1年', D2: '博士課程 2年', D3: '博士課程 3年',
    M1: '修士課程 1年', M2: '修士課程 2年',
    B1: '学部 1年', B2: '学部 2年', B3: '学部 3年', B4: '学部 4年'
  };
  var GRADE_LABELS_EN = {
    D1: 'PhD student, 1st year', D2: 'PhD student, 2nd year', D3: 'PhD student, 3rd year',
    M1: "Master's student, 1st year", M2: "Master's student, 2nd year",
    B1: 'Undergraduate, 1st year', B2: 'Undergraduate, 2nd year',
    B3: 'Undergraduate, 3rd year', B4: 'Undergraduate, 4th year'
  };
  // Faculty/Staff の status は内部的には英語の値なので、英語表示のときはそのまま使う。
  // 日本語表示のときだけ、このマップで日本語に変換する。
  var FACULTY_LABELS_JA = {
    'Professor': '教授',
    'Associate Professor': '准教授',
    'Project Associate Professor': '特任准教授',
    'Assistant Professor': '助教授',
    'Project Assistant Professor': '特任助教授'
  };
  var STAFF_LABELS_JA = {
    'Teaching Assistant': 'TA',
    'Postdoctoral Researcher': 'ポスドク',
    'Special Assistant Teacher': '特別補助教員',
    'Academic Support Staff': '学術支援スタッフ',
    'R&D Staff': '研究開発員',
    'Secretary': '秘書'
  };

  function statusCategory(status) {
    if (FACULTY_STATUSES.indexOf(status) !== -1) return 'faculty';
    if (STAFF_STATUSES.indexOf(status) !== -1) return 'staff';
    if (ALUMNI_STATUSES.indexOf(status) !== -1) return 'alumni';
    return 'student'; // D#/M#/B# など
  }

  // 学生ページ表示用：'D1' → '博士課程 1年' / "PhD student, 1st year"
  function gradeLabel(status) {
    var map = lang() === 'en' ? GRADE_LABELS_EN : GRADE_LABELS_JA;
    return map[status] || status;
  }

  // Faculty/Staff の役職表示。日本語表示のときだけ日本語に変換し、
  // 英語表示のときは元々英語の status 値をそのまま使う
  function statusLabel(status) {
    if (lang() === 'en') return status;
    var cat = statusCategory(status);
    if (cat === 'faculty') return FACULTY_LABELS_JA[status] || status;
    if (cat === 'staff') return STAFF_LABELS_JA[status] || status;
    return status;
  }

  function roleLines(m) {
    var role = lang() === 'en' && m.roleEn ? m.roleEn : m.role;
    var arr = Array.isArray(role) ? role : (role ? [role] : []);
    return arr.map(esc).join('<br>');
  }

  var COURSE_LABELS_JA = {
    B: { name: '学部', verb: '卒業' },
    M: { name: '修士課程', verb: '修了' },
    D: { name: '博士課程', verb: '修了' }
  };
  var COURSE_LABELS_EN = {
    B: { name: "Bachelor's", verb: 'Graduated' },
    M: { name: "Master's", verb: 'Completed' },
    D: { name: 'Doctoral', verb: 'Completed' }
  };
  var MONTH_EN = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

  // 'YYYY-MM-X'（X: B/M/D） → 「2027年3月 修士課程修了」/ "Completed Mar. 2027 (Master's)"
  function formatGraduation(g) {
    var parts = String(g || '').split('-');
    if (parts.length !== 3) return '';
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    if (!y || !m) return '';
    if (lang() === 'en') {
      var courseEn = COURSE_LABELS_EN[parts[2]];
      var monthName = MONTH_EN[m - 1] || m;
      return (courseEn ? courseEn.verb + ' ' : '') + monthName + ' ' + y + (courseEn ? ' (' + courseEn.name + ')' : '');
    }
    var course = COURSE_LABELS_JA[parts[2]];
    var label = course ? course.name : '';
    var verb = course ? course.verb : '修了';
    return y + '年' + m + '月' + (label ? ' ' + label : '') + verb;
  }

  /* ---------- カード生成 ---------- */

  // UIラベル（項目名）の日英対応
  var UI = {
    field:   { ja: '専門分野', en: 'Field' },
    degree:  { ja: '学位',     en: 'Degree' },
    contact: { ja: '連絡先',   en: 'Contact' },
    bio:     { ja: '略歴',     en: 'Bio' },
    comment: { ja: 'ひとこと', en: 'Message' },
    theme:   { ja: '研究テーマ：', en: 'Research theme: ' },
    hobby:   { ja: '趣味',     en: 'Hobbies' }
  };
  function ui(key) { return UI[key][lang() === 'en' ? 'en' : 'ja']; }

  // Faculty（教授・准教授など）：詳しいプロフィールカード
  function facultyCardHtml(m) {
    var name = T(m, 'name');
    var field = T(m, 'field');
    var degree = T(m, 'degree');
    var bio = T(m, 'bio');
    var comment = T(m, 'comment');
    return '<div id="' + esc(m.id) + '" class="member-card flex flex-col md:flex-row items-center md:items-start gap-8 bg-brand-light p-6 sm:p-8 rounded-xl border border-gray-200 w-full hover:border-gray-300 transition-colors duration-300">' +
      '<img src="' + esc(m.photo) + '" alt="' + esc(name) + '" class="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-white flex-shrink-0">' +
      '<div class="text-center md:text-left">' +
        '<h3 class="text-xl sm:text-2xl font-bold text-brand-dark">' + esc(name) + '</h3>' +
        '<p class="text-brand-blue font-bold mb-4 leading-relaxed">' + roleLines(m) + '</p>' +
        '<dl class="text-gray-600 space-y-1 text-sm sm:text-base">' +
          (field ? '<div class="sm:flex sm:gap-2"><dt class="font-bold text-gray-700 flex-shrink-0">' + esc(ui('field')) + '</dt><dd>' + esc(field) + '</dd></div>' : '') +
          (degree ? '<div class="sm:flex sm:gap-2"><dt class="font-bold text-gray-700 flex-shrink-0">' + esc(ui('degree')) + '</dt><dd>' + esc(degree) + '</dd></div>' : '') +
          (m.contact ? '<div class="sm:flex sm:gap-2"><dt class="font-bold text-gray-700 flex-shrink-0">' + esc(ui('contact')) + '</dt><dd>' + esc(m.contact) + '</dd></div>' : '') +
        '</dl>' +
        '<div class="mt-4 space-y-2 text-sm sm:text-base">' +
          (bio ? '<p class="text-gray-600"><span class="font-bold text-gray-700">' + esc(ui('bio')) + '</span>　' + esc(bio) + '</p>' : '') +
          (comment ? '<p class="text-gray-600"><span class="font-bold text-gray-700">' + esc(ui('comment')) + '</span>　' + esc(comment) + '</p>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // Students（D1/M1/B4 など）
  function studentCardHtml(m) {
    var name = T(m, 'name');
    var theme = T(m, 'theme');
    var hobby = T(m, 'hobby');
    var comment = T(m, 'comment');
    return '<li id="' + esc(m.id) + '" class="member-card flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7 bg-brand-light p-5 sm:p-6 rounded-xl border border-gray-100 hover:border-brand-blue/40 hover:bg-blue-50/40 transition-colors">' +
      '<img src="' + esc(m.photo) + '" alt="' + esc(name) + '" class="w-24 h-24 rounded-full object-cover border-2 border-white flex-shrink-0">' +
      '<div class="text-center sm:text-left">' +
        '<p class="text-base sm:text-lg font-bold text-gray-800">' + esc(name) + '</p>' +
        '<p class="text-sm text-brand-blue font-bold">' + esc(gradeLabel(m.status)) + '</p>' +
        (theme ? '<p class="text-sm text-gray-600 mt-2">' + esc(ui('theme')) + esc(theme) + '</p>' : '') +
        (hobby ? '<p class="text-sm text-gray-600 mt-1"><span class="font-bold text-gray-700">' + esc(ui('hobby')) + '</span>　' + esc(hobby) + '</p>' : '') +
        (comment ? '<p class="text-sm text-gray-600 mt-1"><span class="font-bold text-gray-700">' + esc(ui('comment')) + '</span>　' + esc(comment) + '</p>' : '') +
      '</div>' +
    '</li>';
  }

  // Staff（TA・ポスドク・秘書 など）：写真なし
  function staffMemberCardHtml(m) {
    var name = T(m, 'name');
    var comment = T(m, 'comment');
    return '<li id="' + esc(m.id) + '" class="member-card bg-brand-light p-5 sm:p-6 rounded-xl border border-gray-100 hover:border-brand-blue/40 hover:bg-blue-50/40 transition-colors">' +
      '<p class="text-base sm:text-lg font-bold text-gray-800">' + esc(name) + '</p>' +
      '<p class="text-sm text-brand-blue font-bold">' + esc(statusLabel(m.status)) + '</p>' +
      (comment ? '<p class="text-sm text-gray-600 mt-1"><span class="font-bold text-gray-700">' + esc(ui('comment')) + '</span>　' + esc(comment) + '</p>' : '') +
    '</li>';
  }

  // Alumni（OB/OG）：卒業(修了)予定年月(graduation) + 補足(note)
  function alumniItemHtml(m) {
    var name = T(m, 'name');
    var note = T(m, 'note');
    var grad = formatGraduation(m.graduation);
    var metaParts = [];
    if (grad) metaParts.push(grad);
    if (note) metaParts.push(note);
    var sep = lang() === 'en' ? ' \u2013 ' : '・';
    return '<div id="' + esc(m.id) + '" class="member-card py-3 sm:flex sm:items-baseline sm:gap-3">' +
      '<span class="font-bold text-gray-700">' + esc(name) + '</span>' +
      (metaParts.length ? '<span class="text-gray-500 text-sm">' + esc(metaParts.join(sep)) + '</span>' : '') +
    '</div>';
  }

  // 'member-007' のような id 末尾の数字を取り出す（同順位のときの並び替え用）
  function idNumber(id) {
    var m = String(id || '').match(/(\d+)\s*$/);
    return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
  }

  // rankList（FACULTY_STATUSES / STAFF_STATUSES / STUDENT_GRADE_ORDER）の並び順を
  // 「上下関係」として使い、同順位内では id の数字が若い順に並べる
  function sortByRank(list, rankList) {
    return list.slice().sort(function (a, b) {
      var ra = rankList.indexOf(a.status);
      var rb = rankList.indexOf(b.status);
      if (ra === -1) ra = rankList.length;
      if (rb === -1) rb = rankList.length;
      if (ra !== rb) return ra - rb;
      return idNumber(a.id) - idNumber(b.id);
    });
  }

  // 'YYYY-MM-X' → 比較用の数値（大きいほど新しい）。日付不明は最下位扱い
  function graduationSortKey(g) {
    var parts = String(g || '').split('-');
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    if (!y || !m) return -1;
    return y * 100 + m;
  }

  // Alumni：卒業/修了年月が新しい順（古いほど下）。同年月内は id の若い順
  function sortAlumni(list) {
    return list.slice().sort(function (a, b) {
      var ka = graduationSortKey(a.graduation);
      var kb = graduationSortKey(b.graduation);
      if (ka !== kb) return kb - ka;
      return idNumber(a.id) - idNumber(b.id);
    });
  }

  /* ---------- members.html 本体 ---------- */
  function renderMembersPage() {
    var all = window.MEMBERS || [];
    var facultyList = sortByRank(all.filter(function (m) { return statusCategory(m.status) === 'faculty'; }), FACULTY_STATUSES);
    var studentList = sortByRank(all.filter(function (m) { return statusCategory(m.status) === 'student'; }), STUDENT_GRADE_ORDER);
    var staffList = sortByRank(all.filter(function (m) { return statusCategory(m.status) === 'staff'; }), STAFF_STATUSES);
    var alumniList = sortAlumni(all.filter(function (m) { return statusCategory(m.status) === 'alumni'; }));

    var facultyEl = document.getElementById('members-faculty');
    if (facultyEl) facultyEl.innerHTML = facultyList.map(facultyCardHtml).join('');

    var studentsEl = document.getElementById('members-students');
    if (studentsEl) studentsEl.innerHTML = studentList.map(studentCardHtml).join('');

    // Staff セクションは 0 人の間は見出しごと非表示
    var staffSection = document.getElementById('members-staff-section');
    var staffEl = document.getElementById('members-staff');
    if (staffEl) {
      if (staffList.length) {
        staffEl.innerHTML = staffList.map(staffMemberCardHtml).join('');
        if (staffSection) staffSection.classList.remove('hidden');
      } else if (staffSection) {
        staffSection.classList.add('hidden');
      }
    }

    // Alumni セクションも 0 人の間は見出しごと非表示
    var alumniSection = document.getElementById('members-alumni-section');
    var alumniEl = document.getElementById('members-alumni');
    if (alumniEl) {
      if (alumniList.length) {
        alumniEl.innerHTML = '<div class="divide-y divide-gray-200">' + alumniList.map(alumniItemHtml).join('') + '</div>';
        if (alumniSection) alumniSection.classList.remove('hidden');
      } else if (alumniSection) {
        alumniSection.classList.add('hidden');
      }
    }
  }

  // ホーム画面のアバター一覧（Faculty→Studentsの順、それぞれ members.html と同じ並び替えルールを適用。
  // 写真を持たないStaffと卒業生はホームには出さない）
  function renderMembersPreview(el) {
    var facultyList = sortByRank((window.MEMBERS || []).filter(function (m) { return statusCategory(m.status) === 'faculty'; }), FACULTY_STATUSES);
    var studentList = sortByRank((window.MEMBERS || []).filter(function (m) { return statusCategory(m.status) === 'student'; }), STUDENT_GRADE_ORDER);
    var all = facultyList.concat(studentList);
    if (!all.length) return;
    el.innerHTML = all.map(function (m) {
      var name = T(m, 'name');
      var roleArr = lang() === 'en' && m.roleEn ? m.roleEn : (m.role || []);
      roleArr = Array.isArray(roleArr) ? roleArr : (roleArr ? [roleArr] : []);
      var titleSuffix = roleArr.length ? roleArr.join(' / ') : (statusCategory(m.status) === 'student' ? gradeLabel(m.status) : statusLabel(m.status));
      var shortLabel = statusCategory(m.status) === 'student' ? m.status : statusLabel(m.status);
      return '<a href="members.html#' + esc(m.id) + '" class="group flex flex-col items-center gap-2 w-16 flex-shrink-0" title="' + esc(name) + '（' + esc(titleSuffix) + '）">' +
        '<span class="block w-14 h-14 rounded-full overflow-hidden border border-gray-200 group-hover:border-gray-300 transition-colors">' +
          '<img src="' + esc(m.photo) + '" alt="' + esc(name) + '" class="w-full h-full object-cover">' +
        '</span>' +
        '<span class="text-[11px] text-gray-500 text-center leading-tight">' + esc(shortLabel) + '<br>' + esc(name) + '</span>' +
      '</a>';
    }).join('');
  }

  // 横スクロール可能な members-preview の左右に、隠れているメンバーがいることを
  // 示すフェードグラデーションを出し分ける（スクロール位置に応じて自動更新）
  function initMembersScrollFade(el) {
    var leftFade = document.getElementById('members-scroll-fade-left');
    var rightFade = document.getElementById('members-scroll-fade-right');
    if (!leftFade || !rightFade) return;

    function update() {
      var hasOverflow = el.scrollWidth > el.clientWidth + 1;
      var atStart = el.scrollLeft <= 1;
      var atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      leftFade.style.opacity = hasOverflow && !atStart ? '1' : '0';
      rightFade.style.opacity = hasOverflow && !atEnd ? '1' : '0';
    }

    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // レイアウト確定後（画像読み込み等で幅が変わる場合もあるため少し待って再計測）
    requestAnimationFrame(update);
    setTimeout(update, 300);
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderMembersPage();
    var preview = document.getElementById('members-preview');
    if (preview) {
      renderMembersPreview(preview);
      initMembersScrollFade(preview);
    }
    // site.js の scrollToHashTarget は members.js より先に実行され、
    // その時点ではまだカードが存在しないため、書き込み完了後にここで改めて呼ぶ
    if (window.scrollToHashTarget) window.scrollToHashTarget();
  });
})();
