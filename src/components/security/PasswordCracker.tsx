import React, { useState } from "react";
import { Shield, AlertTriangle, Check, X, RefreshCw } from "lucide-react";
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

  // Simulate password cracking
  const crackPassword = () => {
    setIsCracking(true);
    setProgress(0);
    setResult(null);

    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 5;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);

    // Simulate cracking result after a delay
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsCracking(false);

      // Determine if password would be crackable
      const isWeak =
        /^[a-z0-9]{1,8}$/.test(password) ||
        password.toLowerCase().includes(username.toLowerCase()) ||
        ["password", "123456", "qwerty", "admin"].some((weak) =>
          password.toLowerCase().includes(weak),
        );

      setResult({
        cracked: isWeak,
        timeTaken: isWeak
          ? `${Math.floor(Math.random() * 60) + 1} seconds`
          : "Timeout after 24 hours",
        attempts: isWeak ? Math.floor(Math.random() * 10000000) + 1 : 100000000,
        method:
          crackMethod === "wordlist"
            ? `Dictionary (${wordlist})`
            : "Brute Force",
      });
    }, 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            Password Security Analysis
          </h2>
          <p className="text-slate-300">
            Test your password against common cracking methods
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-slate-800 border-slate-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-indigo-300">
              Password Input
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter the password you want to test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Password</label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter password to test"
              />
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger
                  value="wordlist"
                  className="data-[state=active]:bg-indigo-600"
                >
                  Dictionary
                </TabsTrigger>
                <TabsTrigger
                  value="bruteforce"
                  className="data-[state=active]:bg-indigo-600"
                >
                  Brute Force
                </TabsTrigger>
              </TabsList>
              <TabsContent value="wordlist" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Wordlist</label>
                  <Select value={wordlist} onValueChange={setWordlist}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select wordlist" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="rockyou.txt">
                        rockyou.txt (14 million)
                      </SelectItem>
                      <SelectItem value="darkweb2017.txt">
                        darkweb2017.txt (40 million)
                      </SelectItem>
                      <SelectItem value="hibp.txt">
                        Have I Been Pwned (550 million)
                      </SelectItem>
                      <SelectItem value="custom.txt">
                        Custom Wordlist
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      setCrackMethod("wordlist");
                      crackPassword();
                    }}
                    disabled={isCracking || !password}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isCracking ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Running Dictionary Attack...
                      </>
                    ) : (
                      "Start Dictionary Attack"
                    )}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="bruteforce" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm text-slate-300">
                      Character Set
                    </label>
                    <Badge
                      variant="outline"
                      className="bg-indigo-900/50 text-indigo-300 border-indigo-700"
                    >
                      94 characters
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="lowercase"
                        checked
                        className="rounded bg-slate-700"
                      />
                      <label
                        htmlFor="lowercase"
                        className="text-sm text-slate-300"
                      >
                        Lowercase (a-z)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="uppercase"
                        checked
                        className="rounded bg-slate-700"
                      />
                      <label
                        htmlFor="uppercase"
                        className="text-sm text-slate-300"
                      >
                        Uppercase (A-Z)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="numbers"
                        checked
                        className="rounded bg-slate-700"
                      />
                      <label
                        htmlFor="numbers"
                        className="text-sm text-slate-300"
                      >
                        Numbers (0-9)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="special"
                        checked
                        className="rounded bg-slate-700"
                      />
                      <label
                        htmlFor="special"
                        className="text-sm text-slate-300"
                      >
                        Special (!@#$%)
                      </label>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      setCrackMethod("bruteforce");
                      crackPassword();
                    }}
                    disabled={isCracking || !password}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isCracking ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Running Brute Force...
                      </>
                    ) : (
                      "Start Brute Force Attack"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-slate-800 border-slate-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-indigo-300">
              Cracking Simulation
            </CardTitle>
            <CardDescription className="text-slate-400">
              Simulated results using hashcat techniques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isCracking && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">
                    Cracking in progress...
                  </span>
                  <span className="text-indigo-300">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2 bg-slate-700" />
                <div className="bg-slate-700 p-4 rounded-md font-mono text-xs text-green-400 h-32 overflow-auto">
                  <div>
                    $ hashcat -m 0 -a {crackMethod === "wordlist" ? 0 : 3}{" "}
                    hash.txt{" "}
                    {crackMethod === "wordlist" ? wordlist : "?a?a?a?a?a?a?a?a"}
                  </div>
                  <div>Initializing hashcat v6.2.5...</div>
                  <div>
                    * Device #1: NVIDIA GeForce RTX 3080, 10240/10240 MB, 68MCU
                  </div>
                  <div>
                    * Device #2: NVIDIA GeForce RTX 3080, 10240/10240 MB, 68MCU
                  </div>
                  <div>Dictionary cache built:</div>
                  <div>* Filename..: {wordlist}</div>
                  <div>
                    * Passwords.:{" "}
                    {wordlist === "rockyou.txt"
                      ? "14,344,391"
                      : wordlist === "darkweb2017.txt"
                        ? "40,593,089"
                        : "550,273,337"}
                  </div>
                  <div>* Bytes.....: 139,921,497</div>
                  <div>
                    * Keyspace..:{" "}
                    {wordlist === "rockyou.txt"
                      ? "14,344,391"
                      : wordlist === "darkweb2017.txt"
                        ? "40,593,089"
                        : "550,273,337"}
                  </div>
                  <div>Session..........: hashcat</div>
                  <div>Status...........: Running</div>
                  <div>Hash.Mode........: 0 (MD5)</div>
                  <div>Hash.Target......: 5f4dcc3b5aa765d61d8327deb882cf99</div>
                  <div>
                    Speed.#1.........:{" "}
                    {Math.floor(Math.random() * 10000) + 5000} MH/s (88.24ms) @
                    Accel:64 Loops:32 Thr:1024 Vec:1
                  </div>
                  <div>
                    Speed.#2.........:{" "}
                    {Math.floor(Math.random() * 10000) + 5000} MH/s (88.24ms) @
                    Accel:64 Loops:32 Thr:1024 Vec:1
                  </div>
                  <div>
                    Speed.#*.........:{" "}
                    {Math.floor(Math.random() * 20000) + 10000} MH/s
                  </div>
                  <div>Recovered........: 0/1 (0.00%) Digests</div>
                  <div>
                    Progress.........: {Math.floor(progress * 10000)}/
                    {wordlist === "rockyou.txt"
                      ? "14,344,391"
                      : wordlist === "darkweb2017.txt"
                        ? "40,593,089"
                        : "550,273,337"}{" "}
                    (0.00%)
                  </div>
                  <div>
                    Time.Started.....: {new Date().toLocaleTimeString()}
                  </div>
                  <div>Time.Estimated..: Unknown</div>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div
                  className={`flex items-center p-4 ${result.cracked ? "bg-red-900/30" : "bg-green-900/30"} rounded-lg border ${result.cracked ? "border-red-700" : "border-green-700"}`}
                >
                  <div
                    className={`p-2 rounded-full ${result.cracked ? "bg-red-600" : "bg-green-600"} mr-4`}
                  >
                    {result.cracked ? (
                      <X className="h-6 w-6 text-white" />
                    ) : (
                      <Check className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {result.cracked
                        ? "Password Cracked!"
                        : "Password Resistant to Cracking"}
                    </h3>
                    <p
                      className={`text-sm ${result.cracked ? "text-red-300" : "text-green-300"}`}
                    >
                      {result.cracked
                        ? "This password was successfully cracked and is considered insecure."
                        : "This password resisted the cracking attempt and is considered strong."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-slate-300 mb-1">
                      Method Used
                    </h4>
                    <p className="text-indigo-300 font-medium">
                      {result.method}
                    </p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-slate-300 mb-1">
                      Time to Crack
                    </h4>
                    <p
                      className={`font-medium ${result.cracked ? "text-red-400" : "text-green-400"}`}
                    >
                      {result.timeTaken}
                    </p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-slate-300 mb-1">
                      Attempts
                    </h4>
                    <p className="text-white font-medium">
                      {result.attempts.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-slate-300 mb-1">
                      Security Rating
                    </h4>
                    <div className="flex items-center">
                      {result.cracked ? (
                        <Badge className="bg-red-600 hover:bg-red-700">
                          Weak
                        </Badge>
                      ) : (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          Strong
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">
                    Recommendations
                  </h4>
                  {result.cracked ? (
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-red-400 mr-2 mt-0.5" />
                        <span className="text-slate-300">
                          Use a longer password with at least 12 characters
                        </span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-red-400 mr-2 mt-0.5" />
                        <span className="text-slate-300">
                          Include uppercase letters, numbers, and special
                          characters
                        </span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-red-400 mr-2 mt-0.5" />
                        <span className="text-slate-300">
                          Avoid using common words or patterns
                        </span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-red-400 mr-2 mt-0.5" />
                        <span className="text-slate-300">
                          Don't use personal information in your password
                        </span>
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5" />
                        <span className="text-slate-300">
                          Your password is strong against common cracking
                          methods
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5" />
                        <span className="text-slate-300">
                          Consider using a password manager for all your
                          accounts
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5" />
                        <span className="text-slate-300">
                          Enable two-factor authentication for additional
                          security
                        </span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            )}

            {!isCracking && !result && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Shield className="h-12 w-12 text-indigo-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Password Security Analyzer
                </h3>
                <p className="text-slate-400 max-w-md">
                  Select a cracking method and start the simulation to see how
                  your password would perform against real-world cracking
                  attempts.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <div className="text-xs text-slate-500 w-full text-center">
              This is a simulation for educational purposes only. No actual
              password cracking is performed.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PasswordCracker;
