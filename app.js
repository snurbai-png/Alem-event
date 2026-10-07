const SUPABASE_URL = 'https://dulfanhffndctpznmfyb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JZijzOktaD4oqGPtChle5w_QAnM562L';

const headers = {
  apikey: SUPABASE_KEY,
  'Content-Type': 'application/json'
};
async function loadEventName() {
  const params = new URLSearchParams(window.location.search);
  const eventSlug = params.get('event');

  if (!eventSlug) return;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/get_event_name`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          p_event_slug: eventSlug
        })
      }
    );

    if (!res.ok) return;

    const rows = await res.json();
    if (!rows || !rows.length) return;

    const el = document.getElementById('eventName');

    if (el) {
      el.textContent = rows[0].name;
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', loadEventName);
function currentLanguage() {
  return localStorage.getItem('alem_language') || 'kk';
}

const resultTranslations = {
  kk: {
    enterName: 'Аты-жөніңізді енгізіңіз',
    searching: 'Ізделуде...',
    notFound: 'Қонақ табылмады. Аты-жөніңізді дұрыс енгізгеніңізді тексеріңіз.',
    welcome: 'Қош келдіңіз',
    yourTable: 'Сіздің үстеліңіз',
    showMap: 'Үстелімді картадан көрсету',
    mapTitle: 'Сіздің үстеліңіз',
    mapAlt: 'Зал картасы',
    error: 'Қате'
  },

  ru: {
    enterName: 'Введите имя и фамилию',
    searching: 'Поиск...',
    notFound: 'Гость не найден. Проверьте правильность имени и фамилии.',
    welcome: 'Добро пожаловать',
    yourTable: 'Ваш стол',
    showMap: 'Показать мой стол на плане',
    mapTitle: 'Ваш стол',
    mapAlt: 'План зала',
    error: 'Ошибка'
  },

  en: {
    enterName: 'Enter your full name',
    searching: 'Searching...',
    notFound: 'Guest not found. Please check the name and try again.',
    welcome: 'Welcome',
    yourTable: 'Your table',
    showMap: 'Show my table on the map',
    mapTitle: 'Your table',
    mapAlt: 'Floor plan',
    error: 'Error'
  }
};

async function findGuest() {
  const q = document.getElementById('q').value.trim();
  const r = document.getElementById('result');

  const lang = currentLanguage();
  const t = resultTranslations[lang] || resultTranslations.kk;

  r.className = 'show';

  if (!q) {
    r.innerHTML = t.enterName;
    return;
  }

  r.innerHTML = t.searching;

  const params = new URLSearchParams(window.location.search);
  const eventSlug = params.get('event') || 'test-event';

  try {
    const res = await fetch(
      'https://dulfanhffndctpznmfyb.supabase.co/rest/v1/rpc/find_guest',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          p_event_slug: eventSlug,
          p_name: q
        })
      }
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const rows = await res.json();

    if (!rows.length) {
      r.innerHTML = t.notFound;
      return;
    }

    const guest = rows[0];

    r.innerHTML = `
      <div>${t.welcome}, ${guest.full_name}</div>

      <div style="font-size:64px;margin:12px 0;">
        №${guest.table_number}
      </div>

      <div>${t.yourTable}</div> 
      

   <div id="hallMap" style="display:block; margin-top:25px;">

        <div style="font-size:28px; margin-bottom:18px;">
          ${t.mapTitle} — №${guest.table_number}
        </div>

        <img
          src="hall-plan.png"
          alt="${t.mapAlt}"
          style="width:100%; border-radius:18px;"
        >

      </div>
    `;

  } catch (error) {
    console.error(error);
    r.innerHTML = t.error + ': ' + error.message;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('q');

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        findGuest();
      }
    });
  }
});
