const sequelize = require("../connection/connection");

const Admin = require("./adminModel");
const Notice = require("./noticeModel");
const Page = require("./pageModel");
const Slider = require("./sliderModel");
const Leader = require("./leaderModel");
const Stat = require("./statModel");
const QuickLink = require("./quickLinkModel");
const Gallery = require("./galleryModel");
const College = require("./collegeModel");
const Menu = require("./menuModel");
const Section = require("./sectionModel");
const SideMenu = require("./sideMenuModel");
const Professor = require("./professorModel");
const Banner = require("./bannerModel");
const SectionPhoto = require("./sectionPhotoModel");
const SideMenuFile = require("./sideMenuFileModel");
const PageTable = require("./pageTableModel");
const PageTableRow = require("./pageTableRowModel");

const LmsCourse = require("./lmsCourseModel");
const LmsSubject = require("./lmsSubjectModel");
const LmsTeacher = require("./lmsTeacherModel");
const LmsTeacherSubject = require("./lmsTeacherSubjectModel");
const LmsStudent = require("./lmsStudentModel");
const LmsContent = require("./lmsContentModel");

Menu.hasMany(Menu, {
  as: "children",
  foreignKey: "parent_id",
  onDelete: "CASCADE"
});
Menu.belongsTo(Menu, {
  as: "parent",
  foreignKey: "parent_id"
});

Page.belongsTo(Menu, { foreignKey: "menu_id", as: "menu" });
Menu.hasMany(Page, { foreignKey: "menu_id", as: "pages" });

Menu.hasOne(PageTable, { foreignKey: "menu_id", as: "pageTable", onDelete: "CASCADE" });
PageTable.belongsTo(Menu, { foreignKey: "menu_id", as: "menu" });

PageTable.hasMany(PageTableRow, {
  foreignKey: "page_table_id",
  as: "rows",
  onDelete: "CASCADE"
});
PageTableRow.belongsTo(PageTable, { foreignKey: "page_table_id", as: "pageTable" });

Section.hasMany(SideMenu, { foreignKey: "section_id", onDelete: "CASCADE" });
SideMenu.belongsTo(Section, { foreignKey: "section_id" });

Section.hasMany(Professor, { foreignKey: "section_id", onDelete: "CASCADE" });
Professor.belongsTo(Section, { foreignKey: "section_id" });

Section.hasMany(Banner, { foreignKey: "section_id", onDelete: "CASCADE" });
Banner.belongsTo(Section, { foreignKey: "section_id" });

Section.hasMany(SectionPhoto, { foreignKey: "section_id", onDelete: "CASCADE" });
SectionPhoto.belongsTo(Section, { foreignKey: "section_id" });

SideMenu.hasMany(SideMenuFile, { foreignKey: "side_menu_id", onDelete: "CASCADE" });
SideMenuFile.belongsTo(SideMenu, { foreignKey: "side_menu_id" });

// LMS associations (isolated from CMS)
LmsCourse.hasMany(LmsSubject, { foreignKey: "course_id", as: "subjects", onDelete: "CASCADE" });
LmsSubject.belongsTo(LmsCourse, { foreignKey: "course_id", as: "course" });

LmsCourse.hasMany(LmsStudent, { foreignKey: "course_id", as: "students" });
LmsStudent.belongsTo(LmsCourse, { foreignKey: "course_id", as: "course" });

LmsTeacher.belongsToMany(LmsSubject, {
  through: LmsTeacherSubject,
  foreignKey: "teacher_id",
  otherKey: "subject_id",
  as: "subjects"
});
LmsSubject.belongsToMany(LmsTeacher, {
  through: LmsTeacherSubject,
  foreignKey: "subject_id",
  otherKey: "teacher_id",
  as: "teachers"
});

LmsCourse.hasMany(LmsContent, { foreignKey: "course_id", as: "contents", onDelete: "CASCADE" });
LmsSubject.hasMany(LmsContent, { foreignKey: "subject_id", as: "contents", onDelete: "CASCADE" });
LmsContent.belongsTo(LmsCourse, { foreignKey: "course_id", as: "course" });
LmsContent.belongsTo(LmsSubject, { foreignKey: "subject_id", as: "subject" });
LmsContent.belongsTo(LmsTeacher, { foreignKey: "teacher_id", as: "teacher" });
LmsTeacher.hasMany(LmsContent, { foreignKey: "teacher_id", as: "contents" });

// LMS ownership: faculty / department are menus flagged is_faculty / is_department
Section.belongsTo(Section, { foreignKey: "parent_id", as: "parent" });
LmsCourse.belongsTo(Menu, { foreignKey: "faculty_id", as: "faculty", constraints: false });
LmsCourse.belongsTo(Menu, { foreignKey: "department_id", as: "department", constraints: false });
LmsTeacher.belongsTo(Menu, { foreignKey: "faculty_id", as: "faculty", constraints: false });
LmsTeacher.belongsTo(Menu, { foreignKey: "department_id", as: "department", constraints: false });

module.exports = {
  sequelize,
  Admin,
  Notice,
  Page,
  Slider,
  Leader,
  Stat,
  QuickLink,
  Gallery,
  College,
  Menu,
  Section,
  SideMenu,
  Professor,
  Banner,
  SectionPhoto,
  SideMenuFile,
  PageTable,
  PageTableRow,
  LmsCourse,
  LmsSubject,
  LmsTeacher,
  LmsTeacherSubject,
  LmsStudent,
  LmsContent
};
