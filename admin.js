const SUPABASE_URL = 'https://dulfanhffndctpznmfyb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JZijzOktaD4oqGPtChle5w_QAnM562L';

let accessToken = sessionStorage.getItem('alem_admin_token') || '';
let events = [];
let eventId = null;
let currentEvent = null;
let guestRows = [];

const $ = id => document.getElementById(id);

/* =========================
   ТІЛ
========================= */

const adminMessages = {
  kk: {
    enterLogin: 'Email мен парольді енгізіңіз.',
    loggingIn: 'Кіру…',
    wrongLogin: 'Email немесе пароль қате.',
    noEvents: 'Іс-шара жоқ',
    eventsLoadError: 'Іс-шараларды жүктеу мүмкін болмады.',
    enterEventName: 'Іс-шара атауын жазыңыз.',
    creating: 'Құрылуда…',
    eventCreated: 'Іс-шара құрылды ✓',
    currentPlan: 'Қазіргі зал жоспары ✓',
    noPlan: 'Бұл іс-шараға зал жоспары әлі жүктелмеген.',
    selectEvent: 'Алдымен іс-шараны таңдаңыз.',
    selectPlan: 'Зал жоспарының суретін таңдаңыз.',
    selectImage: 'JPG, PNG немесе WebP суретін таңдаңыз.',
    uploadingPlan: 'Зал жоспары жүктелуде…',
    planUploaded: 'Зал жоспары сәтті жүктелді ✓',
    linkCopied: 'Қонақ сілтемесі көшірілді ✓',
    save: 'Сақтау',
    edit: 'Өзгерту',
    delete: 'Өшіру',
    guestNotFound: 'Қонақ табылмады',
    changesSaved: 'Өзгеріс сақталды ✓',
    adding: 'Қосылуда…',
    guestAdded: 'Қонақ қосылды ✓',
    addError: 'Қосу мүмкін болмады.',
    chooseExcel: 'Excel файлын таңдаңыз.',
    readingFile: 'Файл оқылуда…',
    deleteGuest: 'Қонақты өшіру керек пе?',
    deleteError: 'Өшіру мүмкін болмады.'
  },

  ru: {
    enterLogin: 'Введите email и пароль.',
    loggingIn: 'Вход…',
    wrongLogin: 'Неверный email или пароль.',
    noEvents: 'Нет мероприятий',
    eventsLoadError: 'Не удалось загрузить мероприятия.',
    enterEventName: 'Введите название мероприятия.',
    creating: 'Создание…',
    eventCreated: 'Мероприятие создано ✓',
    currentPlan: 'Текущий план зала ✓',
    noPlan: 'План зала ещё не загружен.',
    selectEvent: 'Сначала выберите мероприятие.',
    selectPlan: 'Выберите план зала.',
    selectImage: 'Выберите JPG, PNG или WebP.',
    uploadingPlan: 'Загрузка плана…',
    planUploaded: 'План успешно загружен ✓',
    linkCopied: 'Ссылка скопирована ✓',
    save: 'Сохранить',
    edit: 'Изменить',
    delete: 'Удалить',
    guestNotFound: 'Гость не найден',
    changesSaved: 'Изменения сохранены ✓',
    adding: 'Добавление…',
    guestAdded: 'Гость добавлен ✓',
    addError: 'Не удалось добавить.',
    chooseExcel: 'Выберите Excel файл.',
    readingFile: 'Чтение файла…',
    deleteGuest: 'Удалить гостя?',
    deleteError: 'Не удалось удалить.'
  },

  en: {
    enterLogin: 'Enter your email and password.',
    loggingIn: 'Logging in…',
    wrongLogin: 'Incorrect email or password.',
    noEvents: 'No events',
    eventsLoadError: 'Unable to load events.',
    enterEventName: 'Enter event name.',
    creating: 'Creating…',
    eventCreated: 'Event created ✓',
    currentPlan: 'Current floor plan ✓',
    noPlan: 'No floor plan uploaded.',
    selectEvent: 'Select an event first.',
    selectPlan: 'Select a floor plan.',
    selectImage: 'Select JPG, PNG or WebP.',
    uploadingPlan: 'Uploading…',
    planUploaded: 'Floor plan uploaded ✓',
    linkCopied: 'Guest link copied ✓',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    guestNotFound: 'Guest not found',
    changesSaved: 'Changes saved ✓',
    adding: 'Adding…',
    guestAdded: 'Guest added ✓',
    addError: 'Unable to add guest.',
    chooseExcel: 'Select an Excel file.',
    readingFile: 'Reading file…',
    deleteGuest: 'Delete this guest?',
    deleteError: 'Unable to delete.'
  }
};

function getAdminLang() {
  return localStorage.getItem('alem_admin_language') ||
         localStorage.getItem('alem_language') ||
         'kk';
}

function msg(key) {
  const lang = getAdminLang();
  return adminMessages[lang]?.[key] ||
         adminMessages.kk[key] ||
         '';
}

/* =========================
   SUPABASE
========================= */

function apiHeaders(extra = {}) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    ...extra
  };
}

/* =========================
   LOGIN
========================= */

function setView(loggedIn) {
  if ($('loginCard')) {
    $('loginCard').style.display = loggedIn ? 'none' : 'block';
  }

  if ($('adminPanel')) {
    $('adminPanel').style.display = loggedIn ? 'block' : 'none';
  }
}

async function login() {
  const email = $('email').value.trim();
  const password = $('password').value;

  if (!email || !password) {
    $('loginMsg').textContent = msg('enterLogin');
    return;
  }

  $('loginBtn').disabled = true;
  $('loginMsg').textContent = msg('loggingIn');

  try {
    const res = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      }
    );

    const data = await res.json();

    if (!res.ok || !data.access_token) {
      throw new Error();
    }

    accessToken = data.access_token;

    sessionStorage.setItem(
      'alem_admin_token',
      accessToken
    );

    setView(true);
    await loadEvents();

  } catch (error) {
    $('loginMsg').textContent = msg('wrongLogin');
  } finally {
    $('loginBtn').disabled = false;
  }
}

function logout() {
  sessionStorage.removeItem('alem_admin_token');

  accessToken = '';
  eventId = null;
  currentEvent = null;

  setView(false);

  if ($('password')) {
    $('password').value = '';
  }
}

/* =========================
   ІС-ШАРАЛАР
========================= */

async function loadEvents() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/events?select=id,name,event_date,slug&order=created_at.desc`,
      { headers: apiHeaders() }
    );

    if (res.status === 401) {
      logout();
      return;
    }

    if (!res.ok) {
      throw new Error(await res.text());
    }

    events = await res.json();

    $('eventSelect').innerHTML = events.length
      ? events.map(event => `
          <option value="${event.id}">
            ${esc(event.name)}
            ${event.event_date ? ' · ' + event.event_date : ''}
          </option>
        `).join('')
      : `<option value="">${msg('noEvents')}</option>`;

    if (events.length) {
      const saved = Number(
        sessionStorage.getItem('alem_event_id')
      );

      const selected =
        events.find(e => e.id === saved) ||
        events[0];

      $('eventSelect').value = selected.id;

      await chooseEvent(selected);
    } else {
      $('eventTools').style.display = 'none';
    }

  } catch (error) {
    console.error(error);
    $('eventMsg').textContent =
      msg('eventsLoadError');
  }
}

async function createEvent() {
  const name = $('eventName').value.trim();
  const date = $('eventDate').value.trim();

  if (!name) {
    $('eventMsg').textContent =
      msg('enterEventName');
    return;
  }

  const slug =
    'event-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 7);

  $('eventMsg').textContent = msg('creating');

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/events`,
      {
        method: 'POST',
        headers: apiHeaders({
          Prefer: 'return=representation',
          Accept: 'application/json'
        }),
        body: JSON.stringify({
          name,
          event_date: date || null,
          slug
        })
      }
    );

    const raw = await res.text();

    if (!res.ok) {
      throw new Error(raw);
    }

    const rows = raw ? JSON.parse(raw) : [];
    const event = rows[0];

    if (!event?.id) {
      throw new Error('Event ID алынбады');
    }

    $('eventName').value = '';
    $('eventDate').value = '';

    $('eventMsg').textContent =
      msg('eventCreated');

    sessionStorage.setItem(
      'alem_event_id',
      event.id
    );

    await loadEvents();

  } catch (error) {
    console.error(error);

    $('eventMsg').textContent =
      'Құру қатесі: ' +
      (error.message || 'Белгісіз қате');
  }
}

async function selectEvent() {
  const id = Number($('eventSelect').value);
  const event = events.find(e => e.id === id);

  if (event) {
    await chooseEvent(event);
  }
}

async function chooseEvent(event) {
  currentEvent = event;
  eventId = event.id;

  sessionStorage.setItem(
    'alem_event_id',
    event.id
  );

  $('eventTools').style.display = 'block';

  $('currentEventName').textContent =
    event.name;

  $('currentEventMeta').textContent =
    (event.event_date
      ? event.event_date + ' · '
      : '') +
    'Код: ' +
    event.slug;

  makeQR();
  loadHallPlanPreview();

  await loadGuests();
}

/* =========================
   QR
========================= */

function guestUrl() {
  return (
    `${location.origin}` +
    `${location.pathname.replace(/admin\.html.*$/, 'index.html')}` +
    `?event=${encodeURIComponent(currentEvent.slug)}`
  );
}

function makeQR() {
  const box = $('qrcode');

  if (!box || !currentEvent) return;

  box.innerHTML = '';

  new QRCode(box, {
    text: guestUrl(),
    width: 190,
    height: 190,
    correctLevel: QRCode.CorrectLevel.M
  });
}

async function copyGuestLink() {
  try {
    await navigator.clipboard.writeText(
      guestUrl()
    );

    $('eventMsg').textContent =
      msg('linkCopied');

  } catch (error) {
    prompt(
      'Сілтемені көшіріңіз:',
      guestUrl()
    );
  }
}

async function downloadQR() {
  const canvas =
    $('qrcode')?.querySelector('canvas');

  const img =
    $('qrcode')?.querySelector('img');

  let src = '';

  if (canvas) {
    src = canvas.toDataURL('image/png');
  } else if (img?.src) {
    src = img.src;
  }

  if (!src) {
    alert('QR-код табылмады.');
    return;
  }

  const page = window.open('', '_blank');

  if (!page) {
    alert('Жаңа терезені ашуға рұқсат беріңіз.');
    return;
  }

  page.document.write(`
    <!doctype html>
    <html>
    <head>
      <meta name="viewport"
            content="width=device-width,initial-scale=1">
      <title>ALEM EVENT QR</title>
      <style>
        body {
          margin:0;
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:white;
        }
        img {
          width:85%;
          max-width:600px;
        }
      </style>
    </head>
    <body>
      <img src="${src}" alt="ALEM EVENT QR">
    </body>
    </html>
  `);

  page.document.close();
}

/* =========================
   ЗАЛ ЖОСПАРЫ
========================= */

function hallPlanPath() {
  return currentEvent?.slug
    ? encodeURIComponent(currentEvent.slug)
    : '';
}

function hallPlanPublicUrl() {
  const path = hallPlanPath();

  return path
    ? `${SUPABASE_URL}/storage/v1/object/public/hall-plans/${path}`
    : '';
}

function loadHallPlanPreview() {
  const wrap = $('hallPlanPreview');
  const img = $('hallPlanPreviewImg');
  const status = $('hallPlanMsg');

  if (!wrap || !img || !currentEvent) {
    return;
  }

  const url =
    hallPlanPublicUrl() +
    `?v=${Date.now()}`;

  img.onload = () => {
    wrap.style.display = 'block';

    if (status) {
      status.textContent =
        msg('currentPlan');
    }
  };

  img.onerror = () => {
    wrap.style.display = 'none';

    if (status) {
      status.textContent =
        msg('noPlan');
    }
  };

  img.src = url;
}

async function uploadHallPlan() {
  const file =
    $('hallPlanFile')?.files?.[0];

  const status = $('hallPlanMsg');

  if (!currentEvent || !eventId) {
    status.textContent = msg('selectEvent');
    return;
  }

  if (!file) {
    status.textContent = msg('selectPlan');
    return;
  }

  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (!allowed.includes(file.type)) {
    status.textContent = msg('selectImage');
    return;
  }

  status.textContent =
    msg('uploadingPlan');

  try {
    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/hall-plans/${hallPlanPath()}`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization:
            `Bearer ${accessToken}`,
          'Content-Type': file.type,
          'Cache-Control': '3600',
          'x-upsert': 'true'
        },
        body: file
      }
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    $('hallPlanFile').value = '';

    status.textContent =
      msg('planUploaded');

    loadHallPlanPreview();

  } catch (error) {
    console.error(error);

    status.textContent =
      'Зал жоспарын жүктеу мүмкін болмады.';
  }
}

/* =========================
   ҚОНАҚТАР
========================= */

function esc(value) {
  return String(value ?? '')
    .replace(
      /[&<>'"]/g,
      char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[char])
    );
}

async function loadGuests() {
  if (!eventId) return;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/guests?event_id=eq.${eventId}&select=id,full_name,table_number&order=table_number.asc,full_name.asc`,
      {
        headers: apiHeaders()
      }
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    guestRows = await res.json();

    filterGuests();

  } catch (error) {
    console.error(error);

    $('list').innerHTML =
      '<div class="admin-msg pad">' +
      'Қонақтар тізімін жүктеу мүмкін болмады.' +
      '</div>';
  }
}

function render(rows) {
  $('guestCount').textContent =
    `(${guestRows.length})`;

  $('list').innerHTML = rows.length
    ? rows.map(guest => `
      <div class="guest-row"
           id="guest-${Number(guest.id)}">

        <div class="guest-info">

          <span>
            ${esc(guest.full_name)}
            <b>№${esc(guest.table_number)}</b>
          </span>

          <div
            class="edit-panel"
            id="edit-${Number(guest.id)}">

            <input
              id="edit-name-${Number(guest.id)}"
              value="${esc(guest.full_name)}">

            <input
              id="edit-table-${Number(guest.id)}"
              value="${esc(guest.table_number)}">

            <button
              onclick="saveGuest(${Number(guest.id)})">
              ${msg('save')}
            </button>

          </div>
        </div>

        <div class="guest-actions">

          <button
            class="edit-btn"
            onclick="toggleEdit(${Number(guest.id)})">
            ${msg('edit')}
          </button>

          <button
            onclick="removeGuest(${Number(guest.id)})">
            ${msg('delete')}
          </button>

        </div>
      </div>
    `).join('')
    : `<div class="empty">${msg('guestNotFound')}</div>`;
}

function filterGuests() {
  const input = $('guestSearch');

  if (!input) {
    render(guestRows);
    return;
  }

  const query =
    input.value
      .trim()
      .toLocaleLowerCase('kk-KZ');

  const rows = query
    ? guestRows.filter(guest =>
        String(guest.full_name)
          .toLocaleLowerCase('kk-KZ')
          .includes(query)
      )
    : guestRows;

  render(rows);

  if ($('searchMsg')) {
    $('searchMsg').textContent =
      query
        ? `${rows.length} қонақ табылды`
        : '';
  }
}

function toggleEdit(id) {
  const panel = $(`edit-${id}`);

  if (panel) {
    panel.classList.toggle('open');
  }
}

async function saveGuest(id) {
  const name =
    $(`edit-name-${id}`)?.value.trim();

  const table =
    $(`edit-table-${id}`)?.value.trim();

  if (!name || !table) {
    alert(
      'Аты-жөні мен үстел нөмірін толтырыңыз.'
    );
    return;
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/admin_update_guest`,
      {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({
          p_guest_id: id,
          p_event_id: eventId,
          p_full_name: name,
          p_table_number: table
        })
      }
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    if ($('searchMsg')) {
      $('searchMsg').textContent =
        msg('changesSaved');
    }

    await loadGuests();

  } catch (error) {
    console.error(error);

    alert(
      'Өзгерісті сақтау мүмкін болмады.'
    );
  }
}

async function addGuest() {
  const name = $('n').value.trim();
  const table = $('t').value.trim();

  if (!name || !table || !eventId) {
    $('actionMsg').textContent =
      'Аты-жөні мен үстел нөмірін толтырыңыз.';
    return;
  }

  $('actionMsg').textContent =
    msg('adding');

  try {
    await insertGuests([
      {
        event_id: eventId,
        full_name: name,
        table_number: table
      }
    ]);

    $('n').value = '';
    $('t').value = '';

    $('actionMsg').textContent =
      msg('guestAdded');

    await loadGuests();

  } catch (error) {
    console.error(error);

    $('actionMsg').textContent =
      msg('addError');
  }
}

async function insertGuests(rows) {
  for (let i = 0; i < rows.length; i += 200) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/guests`,
      {
        method: 'POST',
        headers: apiHeaders({
          Prefer: 'return=minimal'
        }),
        body: JSON.stringify(
          rows.slice(i, i + 200)
        )
      }
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }
  }
}

/* =========================
   EXCEL
========================= */

function pick(obj, names) {
  const keys = Object.keys(obj);

  for (const name of names) {
    const key = keys.find(
      item =>
        item.toLowerCase().replace(/\s/g, '') ===
        name.toLowerCase().replace(/\s/g, '')
    );

    if (
      key != null &&
      obj[key] != null &&
      String(obj[key]).trim() !== ''
    ) {
      return String(obj[key]).trim();
    }
  }

  return '';
}

async function importExcel() {
  const file =
    $('excelFile')?.files?.[0];

  if (!file) {
    $('importMsg').textContent =
      msg('chooseExcel');
    return;
  }

  if (!eventId) return;

  $('importMsg').textContent =
    msg('readingFile');

  try {
    const data =
      await file.arrayBuffer();

    const workbook =
      XLSX.read(data, {
        type: 'array'
      });

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const raw =
      XLSX.utils.sheet_to_json(
        sheet,
        { defval: '' }
      );

    const rows = raw
      .map(row => ({
        event_id: eventId,

        full_name: pick(
          row,
          [
            'Аты-жөні',
            'Аты жөні',
            'full_name',
            'name',
            'ФИО',
            'Қонақ'
          ]
        ),

        table_number: pick(
          row,
          [
            'Үстел №',
            'Үстел',
            'table_number',
            'table',
            'Стол',
            'Стол №'
          ]
        )
      }))
      .filter(
        row =>
          row.full_name &&
          row.table_number
      );

    if (!rows.length) {
      throw new Error(
        'Бағандар табылмады'
      );
    }

    $('importMsg').textContent =
      `${rows.length} қонақ табылды. Жүктелуде…`;

    await insertGuests(rows);

    $('excelFile').value = '';

    $('importMsg').textContent =
      `${rows.length} қонақ сәтті қосылды ✓`;

    await loadGuests();

  } catch (error) {
    console.error(error);

    $('importMsg').textContent =
      'Файлды оқу мүмкін болмады. ' +
      'Бағандар «Аты-жөні» және «Үстел №» болсын.';
  }
}

/* =========================
   ӨШІРУ
========================= */

async function removeGuest(id) {
  if (!confirm(msg('deleteGuest'))) {
    return;
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/guests?id=eq.${id}&event_id=eq.${eventId}`,
      {
        method: 'DELETE',
        headers: apiHeaders()
      }
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    await loadGuests();

  } catch (error) {
    console.error(error);
    alert(msg('deleteError'));
  }
}

async function deleteEvent() {
  if (!currentEvent || !eventId) return;

  const ok = confirm(
    `«${currentEvent.name}» іс-шарасын өшіру керек пе?\n\n` +
    'Осы іс-шарадағы барлық қонақ та өшеді.'
  );

  if (!ok) return;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/events?id=eq.${eventId}`,
      {
        method: 'DELETE',
        headers: apiHeaders()
      }
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    sessionStorage.removeItem(
      'alem_event_id'
    );

    eventId = null;
    currentEvent = null;

    $('eventTools').style.display =
      'none';

    $('eventMsg').textContent =
      'Іс-шара және оның қонақтары өшірілді ✓';

    await loadEvents();

  } catch (error) {
    console.error(error);

    if ($('deleteEventMsg')) {
      $('deleteEventMsg').textContent =
        'Іс-шараны өшіру мүмкін болмады.';
    }
  }
}

/* =========================
   START
========================= */

$('password')?.addEventListener(
  'keydown',
  event => {
    if (event.key === 'Enter') {
      login();
    }
  }
);

$('eventCreateForm')?.addEventListener(
  'submit',
  event => {
    event.preventDefault();
    createEvent();
  }
);

if (accessToken) {
  setView(true);
  loadEvents();
} else {
  setView(false);
}
