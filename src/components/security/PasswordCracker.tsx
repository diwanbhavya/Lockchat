import React, { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  Check,
  X,
  RefreshCw,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface PasswordCrackerProps {
  userPassword?: string;
  username?: string;
}

interface CrackResult {
  wordlist: string;
  cracked: boolean;
  timeTaken: string;
  attempts: number;
}

const PasswordCracker = ({
  userPassword = "password123",
  username = "user",
}: PasswordCrackerProps) => {
  const [password, setPassword] = useState(userPassword);
  const [crackMethod, setCrackMethod] = useState("wordlist");
  const [wordlist, setWordlist] = useState("rockyou.txt");
  const [isCracking, setIsCracking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    cracked: boolean;
    timeTaken: string;
    attempts: number;
    method: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("wordlist");
  const [allResults, setAllResults] = useState<CrackResult[]>([]);
  const [showPieChart, setShowPieChart] = useState(false);

  // Wordlists for testing
  const wordlists = [
    { id: "rockyou.txt", name: "rockyou.txt", size: 14344391 },
    { id: "darkweb2017.txt", name: "darkweb2017.txt", size: 40593089 },
    { id: "hibp.txt", name: "Have I Been Pwned", size: 550273337 },
    { id: "custom.txt", name: "Custom Wordlist", size: 5000000 },
  ];

  // Simulate password cracking for a single wordlist
  const crackPassword = (specificWordlist = wordlist) => {
    setIsCracking(true);
    setProgress(0);

    if (!result) {
      setResult(null);
    }

    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 5;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);

    // Determine if password would be crackable
    const isWeak =
      /^[a-z0-9]{1,8}$/.test(password) ||
      password.toLowerCase().includes(username.toLowerCase()) ||
      ["password", "123456", "qwerty", "admin"].some((weak) =>
        password.toLowerCase().includes(weak),
      );

    // Simulate cracking result after a delay
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);

      // Generate result for this wordlist
      const currentResult = {
        wordlist: specificWordlist,
        cracked: isWeak,
        timeTaken: isWeak
          ? `${Math.floor(Math.random() * 60) + 1} seconds`
          : "Timeout after 24 hours",
        attempts: isWeak ? Math.floor(Math.random() * 10000000) + 1 : 100000000,
      };

      // Add to all results
      setAllResults((prev) => [...prev, currentResult]);

      // If this is the last wordlist or we're only testing one, finish cracking
      if (specificWordlist === wordlist || specificWordlist === "all") {
        setIsCracking(false);
        setResult({
          cracked: isWeak,
          timeTaken: isWeak
            ? `${Math.floor(Math.random() * 60) + 1} seconds`
            : "Timeout after 24 hours",
          attempts: isWeak
            ? Math.floor(Math.random() * 10000000) + 1
            : 100000000,
          method:
            crackMethod === "wordlist"
              ? `Dictionary (${specificWordlist})`
              : "Brute Force",
        });
      }
    }, 3000);
  };

  // Test against all wordlists
  const crackWithAllWordlists = () => {
    setAllResults([]);
    setShowPieChart(false);
    setIsCracking(true);

    // Start with the first wordlist
    let currentIndex = 0;

    const testNextWordlist = () => {
      if (currentIndex < wordlists.length) {
        const currentWordlist = wordlists[currentIndex].id;
        crackPassword(currentWordlist);
        currentIndex++;

        // Schedule the next wordlist test
        setTimeout(testNextWordlist, 3500);
      } else {
        // All wordlists tested
        setIsCracking(false);
        setShowPieChart(true);
      }
    };

    // Start testing wordlists
    testNextWordlist();
  };

  // Reset the cracker
  const resetCracker = () => {
    setPassword(userPassword);
    setResult(null);
    setProgress(0);
    setAllResults([]);
    setShowPieChart(false);
  };

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <CardTitle>Password Security Analyzer</CardTitle>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white/10 hover:bg-white/20"
            onClick={resetCracker}
          >
            <RefreshCw className="h-4 w-4 text-white" />
          </Button>
        </div>
        <CardDescription className="text-white/80">
          Test your password against common cracking methods
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs
          defaultValue="wordlist"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wordlist">Dictionary Attack</TabsTrigger>
            <TabsTrigger value="results">Results Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="wordlist" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password to Test
                </label>
                <Input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Enter password to test"
                  disabled={isCracking}
                />
              </div>

              <div>
                <label
                  htmlFor="wordlist"
                  className="block text-sm font-medium text-gray-700"
                >
                  Wordlist
                </label>
                <Select
                  value={wordlist}
                  onValueChange={setWordlist}
                  disabled={isCracking}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select wordlist" />
                  </SelectTrigger>
                  <SelectContent>
                    {wordlists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name} ({(list.size / 1000000).toFixed(1)}M
                        entries)
                      </SelectItem>
                    ))}
                    <SelectItem value="all">Test All Wordlists</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                {isCracking ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cracking in progress...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => crackPassword()}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!password || isCracking}
                    >
                      Test Password
                    </Button>
                    <Button
                      onClick={crackWithAllWordlists}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      disabled={!password || isCracking}
                    >
                      Test Against All Wordlists
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {result && (
              <div
                className={`mt-4 rounded-lg p-4 ${result.cracked ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}
              >
                <div className="flex items-start gap-3">
                  {result.cracked ? (
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  ) : (
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  )}
                  <div>
                    <h3
                      className={`font-medium ${result.cracked ? "text-red-700" : "text-green-700"}`}
                    >
                      {result.cracked
                        ? "Password Vulnerable!"
                        : "Password Secure"}
                    </h3>
                    <p
                      className={`text-sm ${result.cracked ? "text-red-600" : "text-green-600"}`}
                    >
                      {result.cracked
                        ? `Your password was cracked in ${result.timeTaken} using ${result.method}.`
                        : `Your password resisted cracking attempts using ${result.method}.`}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={`${result.cracked ? "border-red-200 text-red-700 bg-red-50" : "border-green-200 text-green-700 bg-green-50"}`}
                      >
                        {result.attempts.toLocaleString()} attempts
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${result.cracked ? "border-red-200 text-red-700 bg-red-50" : "border-green-200 text-green-700 bg-green-50"}`}
                      >
                        {result.timeTaken}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4 pt-4">
            {allResults.length > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-3">
                  {allResults.map((res, index) => (
                    <div
                      key={index}
                      className={`rounded-lg border p-3 ${res.cracked ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {res.cracked ? (
                            <X className="h-4 w-4 text-red-500" />
                          ) : (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                          <span
                            className={`font-medium ${res.cracked ? "text-red-700" : "text-green-700"}`}
                          >
                            {res.wordlist}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${res.cracked ? "border-red-200 text-red-700" : "border-green-200 text-green-700"}`}
                        >
                          {res.cracked ? "Cracked" : "Secure"}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {res.cracked
                          ? `Cracked in ${res.timeTaken} after ${res.attempts.toLocaleString()} attempts`
                          : `Resisted ${res.attempts.toLocaleString()} attempts for ${res.timeTaken}`}
                      </div>
                    </div>
                  ))}
                </div>

                {showPieChart && (
                  <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <PieChart className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">Password Security Summary</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {allResults.some((r) => r.cracked)
                        ? "Your password was cracked by at least one wordlist. Consider using a stronger password."
                        : "Your password resisted all cracking attempts. Good job!"}
                    </p>
                    <div className="flex items-center justify-center py-2">
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <span className="text-xs text-gray-600">
                            Cracked (
                            {allResults.filter((r) => r.cracked).length})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-xs text-gray-600">
                            Secure (
                            {allResults.filter((r) => !r.cracked).length})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-gray-500">
                  No results yet. Test your password against wordlists to see
                  results.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="bg-gray-50 px-6 py-4 text-sm text-gray-500">
        <p>
          Note: This is a simulation for educational purposes. Real password
          cracking depends on many factors including hardware, algorithms, and
          the actual wordlists used.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PasswordCracker;
