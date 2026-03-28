import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  // ✅ Safe values
  const totalIncome = Number(data?.stats?.totalIncome || 0);
  const totalExpenses = Number(data?.stats?.totalExpenses || 0);
  const net = totalIncome - totalExpenses;

  const percentageUsed = Number(data?.percentageUsed || 0);
  const budgetAmount = Number(data?.budgetAmount || 0);
  const spent = Number(data?.totalExpenses || 0);
  const remaining = budgetAmount - spent;

  const categories = data?.stats?.byCategory || {};
  const insights = data?.insights || [];

  const month = data?.month || "this month";

  // ✅ Currency formatter (INR)
  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  // ================= MONTHLY REPORT =================
  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>

        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>
              📊 Monthly Financial Report
            </Heading>

            <Text style={styles.text}>
              Hello {userName || "User"},
            </Text>

            <Text style={styles.text}>
              Here’s your financial summary for {month}:
            </Text>

            {/* Stats */}
            <Section style={styles.statsContainer}>
              <Stat label="Total Income" value={formatCurrency(totalIncome)} />
              <Stat
                label="Total Expenses"
                value={formatCurrency(totalExpenses)}
              />
              <Stat label="Net Balance" value={formatCurrency(net)} />
            </Section>

            {/* Categories */}
            {Object.keys(categories).length > 0 && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>
                  💸 Expenses by Category
                </Heading>

                {Object.entries(categories).map(([cat, amt]) => (
                  <Row
                    key={cat}
                    label={cat}
                    value={formatCurrency(amt)}
                  />
                ))}
              </Section>
            )}

            {/* Insights */}
            {insights.length > 0 && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>
                  🧠 Wealth Insights
                </Heading>

                {insights.map((insight, i) => (
                  <Text key={i} style={styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Footer />
          </Container>
        </Body>
      </Html>
    );
  }

  // ================= BUDGET ALERT =================
  if (type === "budget-alert") {
    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>

        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>
              ⚠️ Budget Alert
            </Heading>

            <Text style={styles.text}>
              Hello {userName || "User"},
            </Text>

            <Text style={styles.text}>
              You’ve used{" "}
              <strong>{percentageUsed.toFixed(1)}%</strong> of your monthly
              budget.
            </Text>

            <Section style={styles.statsContainer}>
              <Stat
                label="Budget Amount"
                value={formatCurrency(budgetAmount)}
              />
              <Stat label="Spent So Far" value={formatCurrency(spent)} />
              <Stat label="Remaining" value={formatCurrency(remaining)} />
            </Section>

            <Text style={styles.alertText}>
              🚨 You're close to your limit. Try reducing expenses.
            </Text>

            <Footer />
          </Container>
        </Body>
      </Html>
    );
  }

  return null;
}

// ================= COMPONENTS =================

function Stat({ label, value }) {
  return (
    <Section style={styles.statBox}>
      <Text style={styles.text}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </Section>
  );
}

function Row({ label, value }) {
  return (
    <Section style={styles.row}>
      <Text style={styles.text}>{label}</Text>
      <Text style={styles.text}>{value}</Text>
    </Section>
  );
}

function Footer() {
  return (
    <Text style={styles.footer}>
      Thank you for using <strong>Finexa</strong>. Keep tracking your finances 🚀
    </Text>
  );
}

// ================= STYLES =================

const styles = {
  body: {
    backgroundColor: "#f4f6f8",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "24px",
    borderRadius: "8px",
    maxWidth: "480px",
  },
  title: {
    color: "#111827",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  text: {
    fontSize: "14px",
    color: "#374151",
    marginBottom: "8px",
  },
  section: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  },
  statsContainer: {
    marginTop: "16px",
  },
  statBox: {
    padding: "10px",
    borderBottom: "1px solid #e5e7eb",
  },
  statValue: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#111827",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
  },
  footer: {
    marginTop: "24px",
    fontSize: "12px",
    textAlign: "center",
    color: "#6b7280",
  },
  alertText: {
    marginTop: "16px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#dc2626",
    textAlign: "center",
  },
};