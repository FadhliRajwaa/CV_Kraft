import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { CvData } from "@/lib/cv/default-data";
import { CV_SECTION_LABELS } from "@/lib/validations/cv";

// Define styles for ATS-friendly PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#000000',
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 15,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: 10,
    marginBottom: 2,
  },
  contactItem: {
    marginHorizontal: 4,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  italic: {
    fontFamily: 'Helvetica-Oblique',
  },
  text: {
    marginBottom: 2,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 10,
  },
  bullet: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
});

export const ProfessionalPdf = ({ data, language }: { data: CvData; language: "id" | "en" }) => {
  const { personalInfo, summary, experiences, educations, skills, certifications, projects, sectionOrder } = data;
  const getLabel = (key: keyof typeof CV_SECTION_LABELS) => CV_SECTION_LABELS[key][language];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || "John Doe"}</Text>
          <View style={styles.contactInfo}>
            {personalInfo.email ? <Text style={styles.contactItem}>{personalInfo.email}</Text> : null}
            {personalInfo.phone ? <Text style={styles.contactItem}>• {personalInfo.phone}</Text> : null}
            {personalInfo.address ? <Text style={styles.contactItem}>• {personalInfo.address}</Text> : null}
          </View>
          <View style={styles.contactInfo}>
            {personalInfo.linkedIn ? <Text style={styles.contactItem}>{personalInfo.linkedIn.replace(/^https?:\/\//, '')}</Text> : null}
            {personalInfo.portfolio ? <Text style={styles.contactItem}>• {personalInfo.portfolio.replace(/^https?:\/\//, '')}</Text> : null}
          </View>
        </View>

        {/* Dynamic Sections */}
        {sectionOrder.map((sectionKey) => {
          if (sectionKey === "personal-info") return null;

          if (sectionKey === "summary" && summary) {
            return (
              <View key="summary" style={styles.section}>
                <Text style={styles.sectionTitle}>{getLabel("summary")}</Text>
                <Text style={styles.text}>{summary}</Text>
              </View>
            );
          }

          if (sectionKey === "experiences" && experiences.length > 0) {
            return (
              <View key="experiences" style={styles.section}>
                <Text style={styles.sectionTitle}>{getLabel("experiences")}</Text>
                {experiences.map((exp, idx) => (
                  <View key={idx} style={{ marginBottom: 6 }}>
                    <View style={styles.row}>
                      <Text style={styles.bold}>{exp.position}</Text>
                      <Text>{exp.startDate} - {exp.isCurrent ? (language === "id" ? "Sekarang" : "Present") : exp.endDate}</Text>
                    </View>
                    <Text style={[styles.italic, styles.text]}>{exp.company}</Text>
                    {exp.description ? <Text style={styles.text}>{exp.description}</Text> : null}
                    {(exp.achievements || []).map((ach, i) => (
                      <View key={i} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{ach}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === "educations" && educations.length > 0) {
            return (
              <View key="educations" style={styles.section}>
                <Text style={styles.sectionTitle}>{getLabel("educations")}</Text>
                {educations.map((edu, idx) => (
                  <View key={idx} style={{ marginBottom: 4 }}>
                    <View style={styles.row}>
                      <Text style={styles.bold}>{edu.institution}</Text>
                      <Text>{edu.startDate} - {edu.endDate}</Text>
                    </View>
                    <Text>
                      {edu.degree} {language === "id" ? "dalam" : "in"} {edu.fieldOfStudy}
                      {edu.gpa ? ` • IPK: ${edu.gpa}` : ""}
                    </Text>
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === "skills" && skills.length > 0) {
            return (
              <View key="skills" style={styles.section}>
                <Text style={styles.sectionTitle}>{getLabel("skills")}</Text>
                {skills.map((skill, idx) => (
                  <View key={idx} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      <Text style={styles.bold}>{skill.category}: </Text>
                      <Text>{skill.name}</Text>
                    </Text>
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === "certifications" && certifications.length > 0) {
            return (
              <View key="certifications" style={styles.section}>
                <Text style={styles.sectionTitle}>{getLabel("certifications")}</Text>
                {certifications.map((cert, idx) => (
                  <View key={idx} style={{ marginBottom: 4 }}>
                    <View style={styles.row}>
                      <Text style={styles.bold}>{cert.name}</Text>
                      <Text>{cert.issueDate}</Text>
                    </View>
                    <Text>{cert.issuer}</Text>
                  </View>
                ))}
              </View>
            );
          }

          if (sectionKey === "projects" && projects.length > 0) {
            return (
              <View key="projects" style={styles.section}>
                <Text style={styles.sectionTitle}>{getLabel("projects")}</Text>
                {projects.map((proj, idx) => (
                  <View key={idx} style={{ marginBottom: 4 }}>
                    <Text style={styles.bold}>{proj.name}</Text>
                    <Text style={styles.text}>{proj.description}</Text>
                    {proj.technologies && proj.technologies.length > 0 ? (
                      <Text style={styles.italic}>
                        {language === "id" ? "Teknologi:" : "Technologies:"} {proj.technologies.join(", ")}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            );
          }

          return null;
        })}
      </Page>
    </Document>
  );
};
