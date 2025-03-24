import Link from "next/link"
import { Shield, Lock, Eye, FileCheck, Server, UserCheck, AlertTriangle, ChevronRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function PrivacyPolicy() {
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
          <Lock className="h-6 w-6 text-[#82f01f]" />
        </div>
        <div
          className="absolute bottom-[25%] left-[15%] w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-bounce"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        >
          <Eye className="h-6 w-6 text-[#82f01f]" />
        </div>
        <div
          className="absolute top-[60%] right-[30%] w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-bounce"
          style={{ animationDuration: "5s", animationDelay: "0.5s" }}
        >
          <Server className="h-6 w-6 text-[#82f01f]" />
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
                <Shield className="w-8 h-8 text-[#82f01f]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#82f01f] to-[#a4ff29] text-transparent bg-clip-text">
                  Privacy Policy
                </h1>
                <p className="text-gray-400">Last updated: March 19, 2023</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              {/* Table of contents */}
              <div className="mb-8 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <FileCheck className="w-5 h-5 mr-2 text-[#82f01f]" />
                  Quick Navigation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Introduction",
                    "Information We Collect",
                    "How We Use Your Information",
                    "Data Sharing and Disclosure",
                    "Your Privacy Choices",
                    "Data Security",
                    "Changes to This Privacy Policy",
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

              <section id="introduction" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <Shield className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Introduction</h2>
                </div>
                <div className="pl-10">
                  <p>
                    At AcronWeb, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                    disclose, and safeguard your information when you use our Speedtest by AcronWeb service.
                  </p>
                  <p>
                    Our speed test is designed to work without a server and runs entirely in your browser using modern
                    web technologies. This means your data stays on your device, providing enhanced privacy compared to
                    traditional speed tests.
                  </p>
                </div>
              </section>

              <section id="information-we-collect" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <Eye className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Information We Collect</h2>
                </div>
                <div className="pl-10">
                  <p>We collect the following types of information when you use our speed test service:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:shadow-md hover:border-[#82f01f]/30 transition-all">
                      <h3 className="font-medium mb-2 text-[#82f01f]">Connection Information</h3>
                      <p className="text-sm text-gray-300">
                        IP address, ISP information, and general location data (city/region level, not precise
                        location).
                      </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:shadow-md hover:border-[#82f01f]/30 transition-all">
                      <h3 className="font-medium mb-2 text-[#82f01f]">Test Results</h3>
                      <p className="text-sm text-gray-300">
                        Download speed, upload speed, ping, jitter, and the server used for testing.
                      </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:shadow-md hover:border-[#82f01f]/30 transition-all">
                      <h3 className="font-medium mb-2 text-[#82f01f]">Device Information</h3>
                      <p className="text-sm text-gray-300">Browser type, operating system, and device type.</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:shadow-md hover:border-[#82f01f]/30 transition-all">
                      <h3 className="font-medium mb-2 text-[#82f01f]">Local Storage</h3>
                      <p className="text-sm text-gray-300">
                        Test history is stored locally on your device using browser storage and is not transmitted to
                        our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="how-we-use-your-information" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <Server className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">How We Use Your Information</h2>
                </div>
                <div className="pl-10">
                  <p>We use the information we collect for the following purposes:</p>
                  <div className="mt-4 space-y-2">
                    {[
                      "To provide and maintain our service",
                      "To improve and optimize our speed test algorithms",
                      "To analyze usage patterns and improve user experience",
                      "To develop new features and services",
                      "To generate anonymous, aggregated statistics about internet speeds in different regions",
                      "To detect and prevent technical issues and abuse",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center p-2 bg-white/5 backdrop-blur-sm rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-[#82f01f] mr-3"></div>
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="data-sharing-and-disclosure" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <UserCheck className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Data Sharing and Disclosure</h2>
                </div>
                <div className="pl-10">
                  <p>We may share your information in the following situations:</p>
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                      <h3 className="font-medium mb-2 text-[#82f01f]">With Service Providers</h3>
                      <p className="text-sm text-gray-300">
                        We may share your information with third-party vendors who provide services on our behalf.
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                      <h3 className="font-medium mb-2 text-[#82f01f]">For Legal Reasons</h3>
                      <p className="text-sm text-gray-300">
                        We may disclose your information if required by law or in response to valid requests by public
                        authorities.
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                      <h3 className="font-medium mb-2 text-[#82f01f]">With Your Consent</h3>
                      <p className="text-sm text-gray-300">
                        We may share your information with your consent or at your direction.
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                      <h3 className="font-medium mb-2 text-[#82f01f]">Aggregated Data</h3>
                      <p className="text-sm text-gray-300">
                        We may share anonymized, aggregated data with third parties for research, marketing, or
                        analytical purposes.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="your-privacy-choices" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <Lock className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Your Privacy Choices</h2>
                </div>
                <div className="pl-10">
                  <p>You can control your privacy in the following ways:</p>
                  <div className="mt-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#82f01f]/10 flex items-center justify-center mr-3">
                            <Eye className="w-5 h-5 text-[#82f01f]" />
                          </div>
                          <span className="font-medium">Opt-out of Analytics</span>
                        </div>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#82f01f]/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                          <span className="inline-block h-5 w-5 translate-x-5 rounded-full bg-[#82f01f] transition-transform" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#82f01f]/10 flex items-center justify-center mr-3">
                            <Server className="w-5 h-5 text-[#82f01f]" />
                          </div>
                          <span className="font-medium">Local Storage Only</span>
                        </div>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#82f01f]/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                          <span className="inline-block h-5 w-5 translate-x-5 rounded-full bg-[#82f01f] transition-transform" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#82f01f]/10 flex items-center justify-center mr-3">
                            <AlertTriangle className="w-5 h-5 text-[#82f01f]" />
                          </div>
                          <span className="font-medium">Delete Data</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-[#82f01f]/50 text-[#82f01f] hover:bg-[#82f01f]/10"
                        >
                          Delete All Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="data-security" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <Lock className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Data Security</h2>
                </div>
                <div className="pl-10">
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information.
                    However, no method of transmission over the Internet or electronic storage is 100% secure, so we
                    cannot guarantee absolute security.
                  </p>
                  <div className="mt-4 p-4 bg-[#82f01f]/10 rounded-xl border border-[#82f01f]/30">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-[#82f01f] mr-2" />
                      <p className="text-sm font-medium">
                        While we strive to use commercially acceptable means to protect your Personal Data, we cannot
                        guarantee its absolute security.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="changes-to-this-privacy-policy" className="mb-8 scroll-mt-20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#82f01f]/10 rounded-full mr-3">
                    <FileCheck className="w-5 h-5 text-[#82f01f]" />
                  </div>
                  <h2 className="text-2xl font-bold">Changes to This Privacy Policy</h2>
                </div>
                <div className="pl-10">
                  <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                    new Privacy Policy on this page and updating the "Last updated" date.
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
                  <p>If you have any questions about this Privacy Policy, please contact us at:</p>
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
          <Link href="/terms" className="text-sm font-medium text-gray-400 hover:text-[#82f01f] transition-colors">
            Terms of Use
          </Link>
          <Link href="/privacy-policy" className="text-sm font-medium text-[#82f01f] transition-colors">
            Privacy Policy
          </Link>
        </div>
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} Acron Web – Sole Proprietorship. All rights reserved.</p>
      </footer>
    </div>
  )
}

