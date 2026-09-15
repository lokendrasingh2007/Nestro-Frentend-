import Link from "next/link";

export const metadata = {
  title: "Terms of Service & Privacy Policy — Nestro",
  description: "Read Nestro's Terms of Service and Privacy Policy.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      <div className="max-w-3xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[28px] font-medium text-[#1E1E1E] mb-2">
            Terms of Service &amp; Privacy Policy
          </h1>
          <p className="text-[13px] text-[#6B7280]">Last updated: August 2026</p>
          <div className="mt-4 h-[2px] w-16 bg-[#C6A27E]" />
        </div>

        {/* Terms of Service */}
        <section className="mb-10">
          <h2 className="text-[18px] font-medium text-[#1E1E1E] mb-4">Terms of Service</h2>

          <div className="space-y-5 text-[13px] text-[#444] leading-relaxed">
            <div>
              <h3 className="font-semibold text-[#2C2016] mb-1">1. Acceptance of Terms</h3>
              <p>By accessing and using Nestro, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#2C2016] mb-1">2. Use of Service</h3>
              <p>Nestro provides an online furniture shopping platform. You agree to use the service only for lawful purposes and in a manner that does not infringe the rights of others.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#2C2016] mb-1">3. Account Registration</h3>
              <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#2C2016] mb-1">4. Orders & Payments</h3>
              <p>All orders are subject to availability. We reserve the right to cancel or refuse any order. Payments are processed securely through our payment partners.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#2C2016] mb-1">5. Returns & Refunds</h3>
              <p>Products may be returned within 7 days of delivery in their original condition. Refunds will be processed within 5–7 business days after the return is received.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#2C2016] mb-1">6. Limitation of Liability</h3>
              <p>Nestro shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
            </div>
          </div>
        </section>

        <div className="h-px bg-[#E8E0D5] mb-10" />

        {/* Privacy Policy */}
        <section className="mb-10">
          <h2 className="text-[18px] font-medium text-[#1E1E1E] mb-4">Privacy Policy</h2>

          <div className="space-y-5 text-[13px] text-[#444] leading-relaxed">
            <div>
              <h3 className="font-semibold text-[#2C2016] mb-1">1. Information We Collect</h3>
              <p>We collect information you provide during registration (name, email, phone), order details, and browsing activity on our platform.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#2C2016] mb-1">2. How We Use Your Information</h3>
              <p>Your information is used to process orders, send order updates, improve our services, and occasionally send promotional offers if you have opted in.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#2C2016] mb-1">3. Data Security</h3>
              <p>We implement industry-standard security measures to protect your personal data. Passwords are encrypted and never stored in plain text.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#2C2016] mb-1">4. Cookies</h3>
              <p>We use cookies to maintain your session and improve your browsing experience. You can disable cookies in your browser settings, though some features may not work correctly.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#2C2016] mb-1">5. Third-Party Services</h3>
              <p>We use third-party services for payment processing and media storage. These providers have their own privacy policies governing the use of your information.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#2C2016] mb-1">6. Your Rights</h3>
              <p>You have the right to access, update, or delete your personal data at any time through your account settings or by contacting us.</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6 text-[13px] text-[#6B7280]">
          <p className="font-medium text-[#1E1E1E] mb-1">Questions?</p>
          <p>If you have any questions about these terms, please contact us at{" "}
            <Link href="/contact" className="text-[#8B5E3C] hover:underline">our contact page</Link>{" "}
            or email us at{" "}
            <a href="mailto:support@nestro.in" className="text-[#8B5E3C] hover:underline">support@nestro.in</a>.
          </p>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <Link href="/register" className="text-[12px] text-[#8B5E3C] hover:underline">
            ← Back to Register
          </Link>
        </div>
      </div>
    </div>
  );
}
