import { RulesSidebar } from "@/components/rules-sidebar"
import { RuleCard } from "@/components/rule-card"
import type { EslintRule } from "@/lib/types"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

async function getEslintRules(): Promise<EslintRule[]> {
  const csvUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ESLint_Rules_Documentation-VvX3mnxI5P600Rez7KnVNs0U95MI2w.csv"
  try {
    const response = await fetch(csvUrl, { cache: "no-store" }) // Fetch fresh data, or use 'force-cache' or revalidate options
    if (!response.ok) {
      console.error(`Failed to fetch CSV: ${response.statusText}`)
      return []
    }
    const csvText = await response.text()

    const lines = csvText.trim().split("\n")
    const headerLine = lines.shift()?.toLowerCase() // Remove header and normalize
    if (!headerLine) return []

    // Expected headers: "plugin name", "rule name", "documentation url" (after toLowerCase and trim)
    // This simple parser assumes values are quoted and there are no commas within quoted values.
    return lines
      .map((line) => {
        const parts = line.split(",")
        // Naively remove quotes from start/end of each part and trim.
        const pluginName = parts[0]?.trim().replace(/^"|"$/g, "") || "N/A"
        const ruleName = parts[1]?.trim().replace(/^"|"$/g, "")
        const documentationUrl = parts[2]?.trim().replace(/^"|"$/g, "") || "#"

        if (!ruleName) return null

        return {
          pluginName: pluginName,
          ruleName: ruleName,
          documentationUrl: documentationUrl,
          id: ruleName.replace(/[^a-zA-Z0-9-_/]/g, "-").toLowerCase(), // Allow slashes for plugin/rule-name
        }
      })
      .filter(Boolean) as EslintRule[]
  } catch (error) {
    console.error("Error fetching or parsing ESLint rules:", error)
    return []
  }
}

export default async function EslintDocsPage() {
  const rules = await getEslintRules()

  if (!rules.length) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-lg bg-card/80 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Rules</AlertTitle>
          <AlertDescription>
            Failed to load ESLint rules. The data source might be unavailable or there was an issue parsing the data.
            Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="relative md:flex">
      <RulesSidebar rules={rules} />
      <main className="flex-1 p-6 md:p-10 space-y-8 md:ml-72 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {" "}
          {/* Content constraint */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-10 mt-4 md:mt-0">
            ESLint Rules Documentation
          </h1>
          {rules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      </main>
    </div>
  )
}
