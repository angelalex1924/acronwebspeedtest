import Link from "next/link"
import {
  FileText,
  FileCheck,
  Scale,
  AlertTriangle,
  Zap,
  Globe,
  Shield,
  UserCheck,
  ArrowLeft,
  ChevronRight,
  Bookmark,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#82f01f]/10 to-[#a4ff29]/10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#4158D0]/10 to-[#C850C0]/10 blur-3xl"></div>

        {/* Animated elements */}
        <div className="absolute top-[20%] left-[10%] w-16 h-16 rounded-full border-4 border-[#82f01f]/20 animate-[spin_15s_linear_infinite]"></div>
        <div className="absolute bottom-[30%] right-[15%] w-24 h-24 rounded-full border-4 border-[#a4ff29]/20 animate-[spin_20s_linear_infinite_reverse]"></div>

        {/* Floating icons */}
        <div
          className="absolute top-[30%] right-[20%] w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-bounce"
          style={{ animationDuration: "3s" }}
        >
          <Scale className="h-6 w-6 text-[#82f01f]" />
        </div>
        <div
          className="absolute bottom-[25%] left-[15%] w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-bounce"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        >
          <Zap className="h-6 w-6 text-[#82f01f]" />
        </div>
        <div
          className="absolute top-[60%] right-[30%] w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-bounce"
          style={{ animationDuration: "5s", animationDelay: "0.5s" }}
        >
          <Globe className="h-6 w-6 text-[#82f01f]" />
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(130,240,31,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(130,240,31,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="group flex items-center">
          <div className="mr-2 relative">
            <div className="absolute inset-0 bg-[#82f01f]/20 rounded-full blur-md group-hover:blur-xl transition-all duration-300"></div>
            <Logo className="h-12 w-auto relative z-10" />
          </div>
        </Link>

        <Link href="/">
          <Button
            variant="outline"
            className="rounded-full border-[#82f01f]/50 text-[#82f01f] hover:bg-[#82f01f]/10 group transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
            Back to Speed Test
          </Button>
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-xl shadow-xl shadow-[#82f01f]/5 rounded-2xl p-8 mb-12 border border-white/20 relative overflow-hidden">
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#82f01f]/30 rounded-tl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#82f01f]/30 rounded-br-2xl"></div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-[#82f01f]/10 rounded-full">
                <FileText className="w-8 h-8 text-[#82f01f]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#82f01f] to-[#a4ff29] text-transparent bg-clip-text">
                  Terms of Use
                </h1>
                <p className="text-gray-400">Last updated: March 19, 2023</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              {/* Table of contents */}
              <div className="mb-8 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Bookmark className="w-5 h-5 mr-2 text-[#82f01f]" />
                  Quick Navigation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Agreement to Terms",
                    "Description of Service",
                    "Use of the Service",
                    "Intellectual Property",
                    "Accuracy of Results",
                    "Limitation of Liability",
                    "Changes to Terms",
                    "Governing Law",
                    "Contact Us",
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center p-2 hover:bg-[#82f01f]/10 rounded-lg transition-colors group"
                    >
                      <ChevronRight className="w-4 h-4 mr-2 text-[#82f01f] group-hover:translate-x-1 transition-transform" />
                      <span>{item}</span>
                    </a>
                  ))}
                </div>
              </div>

              <section id="agreement-to-terms" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <FileCheck className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Agreement to Terms</h2>
                </div>
                <div className="pl-10">
                  <p>
                    By accessing or using the Speedtest by AcronWeb service, you agree to be bound by these Terms of
                    Use. If you disagree with any part of the terms, you may not access the service.
                  </p>
                  <div className="mt-4 p-4 bg-[#82f01f]/10 rounded-xl border border-[#82f01f]/30">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-[#82f01f] mr-2 flex-shrink-0" />
                      <p className="text-sm font-medium">
                        By continuing to use our service, you acknowledge that you have read and understood these Terms
                        of Use and agree to be bound by them.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="description-of-service" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <Zap className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Description of Service</h2>
                </div>
                <div className="pl-10">
                  <p>
                    Speedtest by AcronWeb provides tools to measure internet connection performance, including download
                    speed, upload speed, ping, and jitter. The service is provided "as is" and "as available" without
                    warranties of any kind.
                  </p>
                  <p className="mt-2">
                    Our speed test is built using modern web technologies and runs entirely in your browser without
                    requiring a server. It uses XMLHttpRequest and other web APIs to measure your connection speed
                    accurately.
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:shadow-md hover:border-[#82f01f]/30 transition-all">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#82f01f]/10 flex items-center justify-center mr-2">
                          <ArrowLeft className="w-4 h-4 text-[#82f01f]" />
                        </div>
                        <h3 className="font-medium text-[#82f01f]">Download Speed</h3>
                      </div>
                      <p className="text-sm text-gray-300">
                        Measures how quickly data is transferred from the internet to your device.
                      </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:shadow-md hover:border-[#82f01f]/30 transition-all">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#82f01f]/10 flex items-center justify-center mr-2">
                          <ArrowLeft className="w-4 h-4 text-[#82f01f] rotate-180" />
                        </div>
                        <h3 className="font-medium text-[#82f01f]">Upload Speed</h3>
                      </div>
                      <p className="text-sm text-gray-300">
                        Measures how quickly data is transferred from your device to the internet.
                      </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:shadow-md hover:border-[#82f01f]/30 transition-all">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#82f01f]/10 flex items-center justify-center mr-2">
                          <Zap className="w-4 h-4 text-[#82f01f]" />
                        </div>
                        <h3 className="font-medium text-[#82f01f]">Ping</h3>
                      </div>
                      <p className="text-sm text-gray-300">
                        Measures the time it takes for data to travel from your device to a server and back.
                      </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:shadow-md hover:border-[#82f01f]/30 transition-all">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#82f01f]/10 flex items-center justify-center mr-2">
                          <Activity className="w-4 h-4 text-[#82f01f]" />
                        </div>
                        <h3 className="font-medium text-[#82f01f]">Jitter</h3>
                      </div>
                      <p className="text-sm text-gray-300">
                        Measures the variation in ping over time, indicating connection stability.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="use-of-the-service" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <UserCheck className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Use of the Service</h2>
                </div>
                <div className="pl-10">
                  <p>
                    You agree to use the service only for lawful purposes and in accordance with these Terms. You agree
                    not to:
                  </p>
                  <div className="mt-4 space-y-2">
                    {[
                      "Use the service in any way that violates any applicable laws or regulations",
                      "Attempt to interfere with or disrupt the service or servers connected to the service",
                      "Attempt to reverse engineer, decompile, or otherwise try to extract the source code of our software",
                      "Use automated means, including spiders, robots, crawlers, or data mining tools to access the service",
                      "Use the service to conduct performance testing for commercial purposes without our express permission",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start p-3 bg-white/5 backdrop-blur-sm rounded-lg">
                        <div className="w-5 h-5 rounded-full bg-[#82f01f]/20 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-[#82f01f]"></div>
                        </div>
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="intellectual-property" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <Shield className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Intellectual Property</h2>
                </div>
                <div className="pl-10">
                  <p>
                    The service and its original content, features, and functionality are owned by AcronWeb and are
                    protected by international copyright, trademark, patent, trade secret, and other intellectual
                    property laws.
                  </p>
                  <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-[#82f01f] mr-2" />
                      <p className="text-sm font-medium text-gray-300">
                        All logos, trademarks, service marks, and trade names are the property of AcronWeb or its
                        affiliates and may not be used without prior written consent.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="accuracy-of-results" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <Scale className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Accuracy of Results</h2>
                </div>
                <div className="pl-10">
                  <p>
                    While we strive to provide accurate speed test results, many factors can affect the measurements,
                    including:
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <h3 className="font-medium mb-2 text-[#82f01f]">Device Limitations</h3>
                      <p className="text-sm text-gray-300">
                        Your device's hardware capabilities may limit the maximum speed that can be measured.
                      </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <h3 className="font-medium mb-2 text-[#82f01f]">Background Processes</h3>
                      <p className="text-sm text-gray-300">
                        Other applications or processes running on your device may affect test results.
                      </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <h3 className="font-medium mb-2 text-[#82f01f]">Network Congestion</h3>
                      <p className="text-sm text-gray-300">
                        High traffic on your network or the internet can impact measured speeds.
                      </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <h3 className="font-medium mb-2 text-[#82f01f]">Wi-Fi Interference</h3>
                      <p className="text-sm text-gray-300">
                        Physical obstacles and interference can affect wireless connections.
                      </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 md:col-span-2">
                      <h3 className="font-medium mb-2 text-[#82f01f]">Browser Limitations</h3>
                      <p className="text-sm text-gray-300">
                        Since our speed test runs entirely in the browser, certain browser limitations may affect the
                        accuracy of results, especially for very high-speed connections.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-300">
                      Therefore, we cannot guarantee that the test results will exactly match your actual internet
                      connection speed in all circumstances.
                    </p>
                  </div>
                </div>
              </section>

              <section id="limitation-of-liability" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <AlertTriangle className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Limitation of Liability</h2>
                </div>
                <div className="pl-10">
                  <p>
                    In no event shall AcronWeb, its directors, employees, partners, agents, suppliers, or affiliates be
                    liable for any indirect, incidental, special, consequential, or punitive damages, including without
                    limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                  </p>
                  <div className="mt-4 p-4 bg-[#82f01f]/10 rounded-xl border border-[#82f01f]/30">
                    <div className="space-y-2">
                      {[
                        "Your access to or use of or inability to access or use the service",
                        "Any conduct or content of any third party on the service",
                        "Any content obtained from the service",
                        "Unauthorized access, use, or alteration of your transmissions or content",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start">
                          <ChevronRight className="w-4 h-4 text-[#82f01f] mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section id="changes-to-terms" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <FileCheck className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Changes to Terms</h2>
                </div>
                <div className="pl-10">
                  <p>
                    We reserve the right to modify or replace these Terms at any time. If a revision is material, we
                    will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a
                    material change will be determined at our sole discretion.
                  </p>
                  <div className="mt-4 flex items-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-[#82f01f]/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-[#82f01f]" />
                    </div>
                    <p className="text-sm text-gray-300">
                      It is your responsibility to review these Terms periodically for changes. Your continued use of
                      the Service following the posting of any changes constitutes acceptance of those changes.
                    </p>
                  </div>
                </div>
              </section>

              <section id="governing-law" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <Scale className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Governing Law</h2>
                </div>
                <div className="pl-10">
                  <p className="text-gray-300">
                    These Terms shall be governed by and construed in accordance with the laws of the United States,
                    without regard to its conflict of law provisions.
                  </p>
                </div>
              </section>

              <section id="contact-us" className="scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <UserCheck className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Contact Us</h2>
                </div>
                <div className="pl-10">
                  <p>If you have any questions about these Terms, please contact us at:</p>
                  <div className="mt-4 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between">
                    <div>
                      <p className="font-medium text-[#82f01f]">Email: contact@acronweb.com</p>
                    </div>
                    <Button className="mt-4 md:mt-0 bg-gradient-to-r from-[#82f01f] to-[#a4ff29] hover:from-[#82f01f] hover:to-[#a4ff29] hover:opacity-90 text-white border-0 shadow-lg shadow-[#82f01f]/20 rounded-full">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
          <Link href="/" className="text-sm font-medium text-gray-400 hover:text-[#82f01f] transition-colors">
            Home
          </Link>
          <Link href="/terms" className="text-sm font-medium text-[#82f01f] transition-colors">
            Terms of Use
          </Link>
          <Link
            href="/privacy-policy"
            className="text-sm font-medium text-gray-400 hover:text-[#82f01f] transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} Acron Web – Sole Proprietorship. All rights reserved.</p>
      </footer>
    </div>
  )
}

