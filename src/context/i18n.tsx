"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type LangCode = "en" | "zh" | "hi" | "es" | "fr" | "ar" | "bn" | "ru" | "pt" | "id";

export const LANGUAGES: { code: LangCode; name: string; nativeName: string; rtl?: boolean }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: true },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
];

type Translations = {
  dashboard: string;
  inbox: string;
  issues: string;
  routines: string;
  goals: string;
  approvals: string;
  agents: string;
  org: string;
  skills: string;
  costs: string;
  activity: string;
  settings: string;
  search: string;
  newIssue: string;
  newAgent: string;
  newGoal: string;
  newRoutine: string;
  work: string;
  company: string;
  projects: string;
  save: string;
  saved: string;
  cancel: string;
};

const DICT: Record<LangCode, Translations> = {
  en: {
    dashboard: "Dashboard", inbox: "Inbox", issues: "Issues", routines: "Routines",
    goals: "Goals", approvals: "Approvals", agents: "Agents", org: "Org",
    skills: "Skills", costs: "Costs", activity: "Activity", settings: "Settings",
    search: "Search...", newIssue: "New Issue", newAgent: "New Agent",
    newGoal: "New Goal", newRoutine: "New Routine",
    work: "Work", company: "Company", projects: "Projects",
    save: "Save Changes", saved: "Saved ✓", cancel: "Cancel",
  },
  zh: {
    dashboard: "仪表板", inbox: "收件箱", issues: "任务", routines: "例行程序",
    goals: "目标", approvals: "审批", agents: "智能体", org: "组织",
    skills: "技能", costs: "费用", activity: "活动", settings: "设置",
    search: "搜索...", newIssue: "新任务", newAgent: "新智能体",
    newGoal: "新目标", newRoutine: "新例行程序",
    work: "工作", company: "公司", projects: "项目",
    save: "保存更改", saved: "已保存 ✓", cancel: "取消",
  },
  hi: {
    dashboard: "डैशबोर्ड", inbox: "इनबॉक्स", issues: "कार्य", routines: "रूटीन",
    goals: "लक्ष्य", approvals: "अनुमोदन", agents: "एजेंट", org: "संगठन",
    skills: "कौशल", costs: "लागत", activity: "गतिविधि", settings: "सेटिंग",
    search: "खोजें...", newIssue: "नया कार्य", newAgent: "नया एजेंट",
    newGoal: "नया लक्ष्य", newRoutine: "नई रूटीन",
    work: "कार्य", company: "कंपनी", projects: "प्रोजेक्ट",
    save: "परिवर्तन सहेजें", saved: "सहेजा गया ✓", cancel: "रद्द करें",
  },
  es: {
    dashboard: "Panel", inbox: "Bandeja de entrada", issues: "Tareas", routines: "Rutinas",
    goals: "Objetivos", approvals: "Aprobaciones", agents: "Agentes", org: "Organización",
    skills: "Habilidades", costs: "Costos", activity: "Actividad", settings: "Configuración",
    search: "Buscar...", newIssue: "Nueva tarea", newAgent: "Nuevo agente",
    newGoal: "Nuevo objetivo", newRoutine: "Nueva rutina",
    work: "Trabajo", company: "Empresa", projects: "Proyectos",
    save: "Guardar cambios", saved: "Guardado ✓", cancel: "Cancelar",
  },
  fr: {
    dashboard: "Tableau de bord", inbox: "Boîte de réception", issues: "Tâches", routines: "Routines",
    goals: "Objectifs", approvals: "Approbations", agents: "Agents", org: "Organisation",
    skills: "Compétences", costs: "Coûts", activity: "Activité", settings: "Paramètres",
    search: "Rechercher...", newIssue: "Nouvelle tâche", newAgent: "Nouvel agent",
    newGoal: "Nouvel objectif", newRoutine: "Nouvelle routine",
    work: "Travail", company: "Entreprise", projects: "Projets",
    save: "Enregistrer", saved: "Enregistré ✓", cancel: "Annuler",
  },
  ar: {
    dashboard: "لوحة التحكم", inbox: "صندوق الوارد", issues: "المهام", routines: "الروتين",
    goals: "الأهداف", approvals: "الموافقات", agents: "الوكلاء", org: "الهيكل التنظيمي",
    skills: "المهارات", costs: "التكاليف", activity: "النشاط", settings: "الإعدادات",
    search: "بحث...", newIssue: "مهمة جديدة", newAgent: "وكيل جديد",
    newGoal: "هدف جديد", newRoutine: "روتين جديد",
    work: "عمل", company: "شركة", projects: "مشاريع",
    save: "حفظ التغييرات", saved: "تم الحفظ ✓", cancel: "إلغاء",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড", inbox: "ইনবক্স", issues: "কাজ", routines: "রুটিন",
    goals: "লক্ষ্য", approvals: "অনুমোদন", agents: "এজেন্ট", org: "সংগঠন",
    skills: "দক্ষতা", costs: "খরচ", activity: "কার্যক্রম", settings: "সেটিংস",
    search: "খুঁজুন...", newIssue: "নতুন কাজ", newAgent: "নতুন এজেন্ট",
    newGoal: "নতুন লক্ষ্য", newRoutine: "নতুন রুটিন",
    work: "কাজ", company: "কোম্পানি", projects: "প্রকল্প",
    save: "পরিবর্তন সংরক্ষণ করুন", saved: "সংরক্ষিত ✓", cancel: "বাতিল",
  },
  ru: {
    dashboard: "Панель", inbox: "Входящие", issues: "Задачи", routines: "Рутины",
    goals: "Цели", approvals: "Одобрения", agents: "Агенты", org: "Организация",
    skills: "Навыки", costs: "Затраты", activity: "Активность", settings: "Настройки",
    search: "Поиск...", newIssue: "Новая задача", newAgent: "Новый агент",
    newGoal: "Новая цель", newRoutine: "Новая рутина",
    work: "Работа", company: "Компания", projects: "Проекты",
    save: "Сохранить", saved: "Сохранено ✓", cancel: "Отмена",
  },
  pt: {
    dashboard: "Painel", inbox: "Caixa de entrada", issues: "Tarefas", routines: "Rotinas",
    goals: "Objetivos", approvals: "Aprovações", agents: "Agentes", org: "Organização",
    skills: "Habilidades", costs: "Custos", activity: "Atividade", settings: "Configurações",
    search: "Pesquisar...", newIssue: "Nova tarefa", newAgent: "Novo agente",
    newGoal: "Novo objetivo", newRoutine: "Nova rotina",
    work: "Trabalho", company: "Empresa", projects: "Projetos",
    save: "Salvar alterações", saved: "Salvo ✓", cancel: "Cancelar",
  },
  id: {
    dashboard: "Dasbor", inbox: "Kotak Masuk", issues: "Tugas", routines: "Rutinitas",
    goals: "Tujuan", approvals: "Persetujuan", agents: "Agen", org: "Organisasi",
    skills: "Keahlian", costs: "Biaya", activity: "Aktivitas", settings: "Pengaturan",
    search: "Cari...", newIssue: "Tugas Baru", newAgent: "Agen Baru",
    newGoal: "Tujuan Baru", newRoutine: "Rutinitas Baru",
    work: "Pekerjaan", company: "Perusahaan", projects: "Proyek",
    save: "Simpan Perubahan", saved: "Tersimpan ✓", cancel: "Batal",
  },
};

interface I18nCtx {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: Translations;
}

const I18nContext = createContext<I18nCtx>({
  lang: "en",
  setLang: () => {},
  t: DICT.en,
});

export const useI18n = () => useContext(I18nContext);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    // Apply RTL for Arabic
    const rtl = LANGUAGES.find((x) => x.code === l)?.rtl ?? false;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, []);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: DICT[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}
