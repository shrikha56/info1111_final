import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    borderBottom: 1,
    paddingBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 3,
    marginLeft: 10,
  },
  signature: {
    marginTop: 50,
    fontSize: 12,
  },
})

export default function FinancialReport() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>STRATA CORPORATION</Text>
        <Text style={styles.title}>Annual Financial Report 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.text}>
            This report presents the financial performance and position of our strata corporation for the year ending December 31, 2024. The corporation has maintained strong financial health with increased reserves and successful completion of major maintenance projects.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Highlights</Text>
          <Text style={styles.listItem}>1. Total Revenue: $1,250,000</Text>
          <Text style={styles.listItem}>   - Strata Fees: $900,000</Text>
          <Text style={styles.listItem}>   - Special Levies: $300,000</Text>
          <Text style={styles.listItem}>   - Other Income: $50,000</Text>
          
          <Text style={styles.listItem}>2. Total Expenses: $950,000</Text>
          <Text style={styles.listItem}>   - Maintenance & Repairs: $400,000</Text>
          <Text style={styles.listItem}>   - Insurance: $150,000</Text>
          <Text style={styles.listItem}>   - Utilities: $200,000</Text>
          <Text style={styles.listItem}>   - Administrative: $100,000</Text>
          <Text style={styles.listItem}>   - Reserve Fund Contributions: $100,000</Text>
          
          <Text style={styles.listItem}>3. Net Surplus: $300,000</Text>
          <Text style={styles.listItem}>   - Added to Reserve Fund: $200,000</Text>
          <Text style={styles.listItem}>   - Operating Surplus: $100,000</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reserve Fund Status</Text>
          <Text style={styles.listItem}>Opening Balance (Jan 1, 2024): $2,500,000</Text>
          <Text style={styles.listItem}>Contributions: $300,000</Text>
          <Text style={styles.listItem}>Expenditures: $150,000</Text>
          <Text style={styles.listItem}>Closing Balance (Dec 31, 2024): $2,650,000</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Major Projects Completed</Text>
          <Text style={styles.listItem}>1. Building Facade Renovation: $250,000</Text>
          <Text style={styles.listItem}>2. Parking Lot Resurfacing: $100,000</Text>
          <Text style={styles.listItem}>3. Security System Upgrade: $75,000</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Performance</Text>
          <Text style={styles.text}>
            The corporation achieved 95% of budgeted revenue and maintained expenses within 92% of budgeted amounts. This reflects strong financial management and cost control measures.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Future Outlook</Text>
          <Text style={styles.listItem}>1. Planned Projects for 2025:</Text>
          <Text style={styles.listItem}>   - HVAC System Upgrade: Estimated $200,000</Text>
          <Text style={styles.listItem}>   - Common Area Renovation: Estimated $150,000</Text>
          <Text style={styles.listItem}>   - Fire Safety System Update: Estimated $100,000</Text>
          
          <Text style={styles.listItem}>2. Reserve Fund Projections:</Text>
          <Text style={styles.listItem}>   - Target Balance by 2025: $2,800,000</Text>
          <Text style={styles.listItem}>   - Required Monthly Contributions: $25,000</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <Text style={styles.listItem}>1. Maintain current strata fee levels</Text>
          <Text style={styles.listItem}>2. Continue aggressive reserve fund contributions</Text>
          <Text style={styles.listItem}>3. Implement energy efficiency measures</Text>
          <Text style={styles.listItem}>4. Regular review of insurance coverage</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conclusion</Text>
          <Text style={styles.text}>
            The corporation remains in a strong financial position with healthy reserves and successful completion of major projects. The financial management strategies implemented have proven effective, and we are well-positioned for future capital projects.
          </Text>
        </View>

        <View style={styles.signature}>
          <Text>Prepared by:</Text>
          <Text>John Smith, CPA</Text>
          <Text>Financial Controller</Text>
          <Text>Strata Corporation</Text>
          <Text>Date: March 15, 2024</Text>
        </View>
      </Page>
    </Document>
  )
} 