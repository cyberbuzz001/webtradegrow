/**
 * One-off generator for the /learn/ education pages.
 * They share an identical shell, so they are generated rather than hand-copied.
 * Re-run after editing the `pages` array below:  node build/gen-learn-pages.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'site', 'pages', 'learn');

const pages = [
  {
    slug: 'how-to-verify-a-stock-broker',
    title: 'How to Verify a Stock Broker in India (Step by Step)',
    desc: "A practical checklist for confirming that a broker is genuinely SEBI-registered and an exchange member, using the regulator's own databases.",
    h1: 'How to verify a stock broker in India',
    lede: 'Five checks, all free, all on websites the broker does not control. Run them on us, and on anyone else asking for your PAN.',
    body: `
<h2>Why this matters more than it used to</h2>
<p>Opening a trading account is now a ten-minute phone process. That convenience cuts both ways: it is also ten minutes to hand your PAN, Aadhaar and bank details to an entity you have not checked. Impersonation of real brokers is common, and so are platforms that look like brokers but are not registered at all.</p>
<p>The good news is that verification is genuinely easy. Every fact that matters is published by a regulator, an exchange, a depository or the Ministry of Corporate Affairs &mdash; none of whom are paid by the broker.</p>

<h2>Step 1 &mdash; Get the legal entity name, not the brand name</h2>
<p>Brand names are marketing. Registrations belong to legal entities. Before anything else, find the registered company name and the SEBI registration number. A legitimate broker publishes both, usually in the website footer and on a dedicated page.</p>
<p>If you cannot find a registration number on the website at all, you can stop here.</p>

<h2>Step 2 &mdash; Look up the SEBI registration</h2>
<p>Search the registration number in SEBI's intermediaries database. Check three things: the number exists, the entity name matches, and the registration is current rather than lapsed or cancelled.</p>
<p><a href="https://www.sebi.gov.in/intermediaries.html" target="_blank" rel="noopener noreferrer">SEBI intermediaries search</a></p>

<h2>Step 3 &mdash; Check exchange membership</h2>
<p>A broker executing your trades on NSE or BSE must be a member of that exchange. Both publish searchable member directories showing the member code, the entity, and the segments they are permitted to operate in.</p>
<p>Pay attention to segments. A broker may be a member for equity but not for commodities. If someone is offering you a segment that does not appear against their name, ask why.</p>
<p><a href="https://www.nseindia.com/invest/find-a-stock-broker" target="_blank" rel="noopener noreferrer">NSE member search</a> &middot; <a href="https://www.bseindia.com/members/MembersDirectory.html" target="_blank" rel="noopener noreferrer">BSE member directory</a></p>

<h2>Step 4 &mdash; Check the depository participant</h2>
<p>Your shares are held in a demat account with CDSL or NSDL, not with the broker. The broker acts as a Depository Participant, or ties up with one. Look up the DP ID on the depository's own website.</p>
<p>This step is worth doing because it tells you where your shares actually sit. If a broker fails, securities in your demat account remain yours and remain with the depository.</p>
<p><a href="https://www.cdslindia.com/DP/dplist.aspx" target="_blank" rel="noopener noreferrer">CDSL DP list</a> &middot; <a href="https://nsdl.co.in/dpsch.php" target="_blank" rel="noopener noreferrer">NSDL DP search</a></p>

<h2>Step 5 &mdash; Check the company itself</h2>
<p>Search the CIN on the MCA portal for incorporation date, registered office and company status. A recently incorporated company is not automatically a problem &mdash; every firm was new once &mdash; but you should make that decision knowingly rather than assume a long history that is not there.</p>
<p><a href="https://www.mca.gov.in/mcafoportal/companyLLPMasterData.do" target="_blank" rel="noopener noreferrer">MCA company master data</a></p>

<h2>Three extra checks worth ninety seconds</h2>
<ul>
<li><strong>App developer name.</strong> On Google Play or the App Store, the developer listed should be the registered entity. A mismatch is serious.</li>
<li><strong>Named compliance officer.</strong> Registered brokers must publish one. If nobody will tell you who it is, that is an answer.</li>
<li><strong>Grievance path.</strong> A real broker will tell you how to escalate past them, to the exchange and to SEBI SCORES. A fraudulent one will not want you to know that route exists.</li>
</ul>

<h2>Warning signs that should stop you entirely</h2>
<!--lint:ignore-->
<ul>
<li>Anyone asking for your OTP, password or PIN, for any stated reason</li>
<li>Any promise of assured returns or guaranteed profits from trading</li>
<li>A request to transfer funds to an individual's bank account, UPI ID or wallet</li>
<li>An app sent to you as a file or a link rather than from an official store</li>
<li>Pressure to decide today, or an offer that expires within hours</li>
</ul>
<!--/lint:ignore-->`,
  },

  {
    slug: 'brokerage-charges-explained',
    title: 'Brokerage and Trading Charges in India, Explained',
    desc: 'What you actually pay on a trade: brokerage, STT, GST, stamp duty, exchange transaction charges, SEBI turnover fees and DP charges.',
    h1: 'Brokerage charges explained',
    lede: 'Brokerage is the part your broker sets. It is usually not the largest part of what you pay.',
    body: `
<h2>Two categories, and the difference matters</h2>
<p>Every charge on an Indian trade falls into one of two buckets:</p>
<ul>
<li><strong>Brokerage</strong> &mdash; set by the broker, kept by the broker. This is the competitive part.</li>
<li><strong>Statutory and regulatory charges</strong> &mdash; set by the Government, the exchanges, the depositories and SEBI. The broker collects them and passes them on. These are identical no matter which broker you use.</li>
</ul>
<p>When a broker advertises a low or nil brokerage, they are talking about the first bucket only. That can still be a real saving. It is not the same as a trade being free.</p>

<h2>The charges, one by one</h2>

<h3>Brokerage</h3>
<p>Either a percentage of turnover or a flat fee per executed order, often with a cap. Delivery, intraday and F&amp;O are usually priced differently. Check whether a flat fee is per order or per executed lot &mdash; the difference is significant if your orders fill in parts.</p>

<h3>Securities Transaction Tax (STT)</h3>
<p>A central government tax on securities transactions. The rate and the side it applies to depend on the segment: equity delivery is taxed on both buy and sell, while intraday and futures are taxed on the sell side only. In options, STT applies on the sell-side premium, and separately on exercised contracts. STT is usually the largest single charge on a delivery trade.</p>

<h3>GST</h3>
<p>Charged on brokerage and on certain regulatory charges &mdash; not on the value of the shares. Because it is levied on brokerage, a lower brokerage also means a lower GST amount.</p>

<h3>Stamp duty</h3>
<p>A state levy applied on the buy side, collected in a uniform centralised manner since 2020. Rates differ by segment.</p>

<h3>Exchange transaction charges</h3>
<p>Charged by NSE or BSE on turnover, at rates the exchange sets and revises from time to time. Rates differ substantially between segments &mdash; options are charged on premium turnover, which is why option charges look large relative to the premium paid.</p>

<h3>SEBI turnover fees</h3>
<p>A small levy on turnover that funds the regulator. Minor in absolute terms but present on every trade.</p>

<h3>DP charges</h3>
<p>Applied when shares leave your demat account, which in practice means when you sell delivery holdings. Usually a flat amount per scrip per day, regardless of quantity. This is the charge that most surprises new investors, because it does not scale with trade size.</p>
<p>The practical consequence: selling small quantities of many different stocks is disproportionately expensive. Selling 10 shares each of five companies incurs five DP charges. Selling 5,000 shares of one company incurs one.</p>

<h2>Charges outside the trade</h2>
<ul>
<li><strong>Account opening</strong> &mdash; one-time, sometimes waived</li>
<li><strong>Demat AMC</strong> &mdash; annual, charged whether or not you trade</li>
<li><strong>Call and trade</strong> &mdash; for orders placed over the phone</li>
<li><strong>Auto square-off</strong> &mdash; when the broker closes an intraday position you left open</li>
<li><strong>Payment gateway</strong> &mdash; on certain funding methods</li>
<li><strong>Pledge and unpledge</strong> &mdash; if you use holdings as collateral</li>
</ul>

<h2>How to compare honestly</h2>
<p>Take a trade you actually place &mdash; your typical quantity, your typical price, your typical segment &mdash; and price it at each broker including all charges. Comparing headline brokerage alone will mislead you, because the statutory part is identical and often dominates.</p>
<p>For a delivery investor making a few trades a month, AMC and DP charges may matter more than brokerage. For an active intraday trader, per-order brokerage dominates. There is no single cheapest broker; there is a cheapest broker for how you trade.</p>
<p><a href="/pricing/#calculator">Use our cost calculator</a> to price a specific trade.</p>`,
  },

  {
    slug: 'what-is-stt',
    title: 'What is STT (Securities Transaction Tax)?',
    desc: 'STT explained: what it is, which segments and which side it applies to, and why it is not something any broker can waive.',
    h1: 'What is STT?',
    lede: 'Securities Transaction Tax is a central government tax on securities transactions. Your broker collects it. Your broker does not keep it.',
    body: `
<h2>The basics</h2>
<p>STT is levied by the Government of India on transactions in listed securities on a recognised stock exchange. It was introduced to tax securities transactions directly at the point of trade. It is collected by the broker at the time of the transaction and remitted to the government.</p>
<p>Because it is a tax, no broker can reduce, waive or discount it. A platform claiming to offer trading free of tax is describing something that does not exist in Indian law.</p>

<h2>Which side is it charged on?</h2>
<p>This is the part that confuses most new traders, because it differs by segment:</p>
<ul>
<li><strong>Equity delivery</strong> &mdash; charged on both the buy and the sell.</li>
<li><strong>Equity intraday</strong> &mdash; charged on the sell side only.</li>
<li><strong>Futures</strong> &mdash; charged on the sell side only.</li>
<li><strong>Options</strong> &mdash; charged on the sell-side premium. Separately, exercised or assigned options attract STT on intrinsic value at a different rate.</li>
</ul>
<p>The exercised-options rule is worth knowing. Traders have been caught out by letting a deep in-the-money option go to exercise rather than squaring off, and finding the STT on intrinsic value considerably larger than expected.</p>

<h2>Why STT often dominates the charge list</h2>
<p>On a delivery trade, STT is typically the single largest line item, frequently larger than brokerage even at full-service rates. This is the main reason why comparing brokers on brokerage alone gives a distorted picture: a large and identical part of your cost is unaffected by which broker you choose.</p>

<h2>STT and your taxes</h2>
<p>STT is separate from capital gains tax. Paying STT does not settle your income tax liability on gains, and gains remain reportable in your return. How STT interacts with your tax position depends on your circumstances and on current tax law.</p>
<p>Trade Grow does not provide tax advice. For anything beyond the mechanics described here, consult a qualified tax professional.</p>

<h2>Where to see exactly what you paid</h2>
<p>Your contract note itemises STT separately for each trading day. That document is the authoritative record &mdash; more so than any calculator, including ours.</p>
<p><a href="/pricing/">See how STT appears in our charge tables</a></p>`,
  },

  {
    slug: 'what-is-dp-charge',
    title: 'What is a DP Charge?',
    desc: 'DP charges explained: what they are, when they apply, why they are flat per scrip, and how they affect small sell orders.',
    h1: 'What is a DP charge?',
    lede: 'A flat fee applied when shares leave your demat account. It does not scale with trade size, which makes it the most misunderstood charge in Indian broking.',
    body: `
<h2>What it is</h2>
<p>DP stands for Depository Participant. Your shares are held in a demat account with a depository &mdash; CDSL or NSDL &mdash; and the broker or its partner acts as the participant that maintains your account.</p>
<p>When securities are debited from your demat account, the depository and the participant levy a charge. In practice this means: when you sell holdings you own in delivery.</p>

<h2>When it applies, and when it does not</h2>
<ul>
<li><strong>Applies:</strong> selling shares held in delivery.</li>
<li><strong>Does not apply:</strong> buying shares. Intraday trades. Futures and options. Positions squared off the same day.</li>
</ul>
<p>The logic is straightforward: nothing leaves your demat account unless you are delivering shares out of it.</p>

<h2>The part that catches people out</h2>
<p>DP charges are flat per scrip per day, regardless of quantity or value. Selling one share and selling five thousand shares of the same company on the same day cost the same DP charge.</p>
<p>This has a real consequence for small portfolios. Consider selling 10 shares each of five different companies. That is five separate DP charges &mdash; which on a small sale value can represent a meaningful percentage of the proceeds.</p>
<p>The practical takeaway: DP charges penalise selling small quantities across many stocks. If you are trimming a portfolio, the number of different scrips matters more than the amount you sell.</p>

<h2>Why it is not something a broker discounts to zero</h2>
<p>Part of the DP charge goes to the depository, which sets its own rate. The participant's share can vary between brokers, so DP charges are not identical everywhere &mdash; unlike STT or stamp duty. It is worth comparing, particularly if you are a delivery investor rather than an intraday trader.</p>

<h2>What to check on your own account</h2>
<ul>
<li>The DP charge per scrip in your broker's published schedule of charges</li>
<li>Whether GST is applied on top of it</li>
<li>Whether the charge appears on your contract note or as a separate debit in your ledger</li>
<li>Your demat holding statement, which comes from the depository directly rather than from the broker</li>
</ul>
<p><a href="/pricing/#calculator">Estimate DP charges on a delivery sell</a></p>`,
  },

  {
    slug: 'what-is-demat-account',
    title: 'What is a Demat Account?',
    desc: 'How demat and trading accounts differ, who actually holds your shares, and what happens to your holdings if a broker shuts down.',
    h1: 'What is a demat account?',
    lede: 'A demat account holds your shares. A trading account places your orders. Knowing the difference tells you where your money actually sits.',
    body: `
<h2>Two different accounts doing two different jobs</h2>
<ul>
<li><strong>Trading account</strong> &mdash; used to place buy and sell orders on the exchange. Opened with a broker.</li>
<li><strong>Demat account</strong> &mdash; holds your securities in electronic form. Maintained with a depository through a Depository Participant.</li>
</ul>
<p>Most brokers open both together, which is why the distinction gets blurred in conversation. It becomes important the moment something goes wrong.</p>

<h2>Who actually holds your shares</h2>
<p>This is the single most useful thing to understand. Your shares sit in your demat account with CDSL or NSDL. They are recorded in your name at the depository, not pooled in the broker's name.</p>
<p>You can verify your own holdings directly with the depository, independently of your broker. Both CDSL and NSDL provide investor access to holding statements, and both send periodic statements to your registered email.</p>
<p>The practical implication: if a broker ceases operations, securities in your demat account remain yours. You can transfer your demat account to another participant. This is exactly why the question &ldquo;what happens to my shares if you shut down?&rdquo; deserves a clear answer from any new broker, and why a vague one should worry you.</p>

<h2>What a demat account can hold</h2>
<ul>
<li>Equity shares</li>
<li>Exchange traded funds</li>
<li>Bonds and government securities</li>
<li>Mutual fund units, if held in demat form</li>
<li>Sovereign gold bonds</li>
</ul>

<h2>What it costs to maintain</h2>
<p>Typically an annual maintenance charge, plus DP charges when securities are debited. Some brokers waive AMC for the first year or for smaller holdings. AMC is charged whether or not you trade, so for a dormant account it is the main ongoing cost.</p>

<h2>Things worth doing once, properly</h2>
<ul>
<li><strong>Add a nominee.</strong> This is the single highest-value administrative task in the whole process, and the one most often skipped. Without it, transmission to your family after death becomes materially harder.</li>
<li><strong>Keep your email and mobile current.</strong> Depository statements and alerts go there.</li>
<li><strong>Read the depository's statements.</strong> They come from an independent source and are a genuine cross-check on your broker.</li>
</ul>
<p><a href="/learn/how-kyc-works/">Next: how KYC works</a></p>`,
  },

  {
    slug: 'how-kyc-works',
    title: 'How KYC Works for a Trading Account',
    desc: 'What KYC is, which documents are required, what happens at each stage, and why nobody should ever ask you for your OTP.',
    h1: 'How KYC works',
    lede: 'Know Your Customer is a regulatory requirement, not a broker formality. Here is what each step is actually for.',
    body: `
<h2>Why KYC exists</h2>
<p>KYC requirements come from regulation, principally anti-money-laundering law and SEBI rules. Their purpose is to establish that you are who you say you are, that the account is operated by you, and that funds are traceable to you.</p>
<p>That is also why some steps that feel like friction &mdash; bank account in your own name, no third-party transfers &mdash; are not the broker being difficult. They are legal requirements the broker cannot waive for you.</p>

<h2>What you will be asked for</h2>
<ul>
<li><strong>PAN</strong> &mdash; mandatory. Validated against income tax records.</li>
<li><strong>Proof of identity and address</strong> &mdash; usually Aadhaar, verified digitally via OTP to your Aadhaar-linked mobile.</li>
<li><strong>Bank account proof</strong> &mdash; in your own name. Payouts can legally go only to your own account.</li>
<li><strong>Signature specimen</strong> &mdash; on plain paper, matching your bank records.</li>
<li><strong>Photograph and in-person verification</strong> &mdash; typically completed digitally through a short video step.</li>
<li><strong>Income proof</strong> &mdash; only if you want to trade derivatives.</li>
</ul>

<h2>The KRA system, and why onboarding is sometimes faster</h2>
<p>SEBI-registered KYC Registration Agencies hold KYC records centrally. If you have completed KYC with any registered intermediary before, parts of your record can be fetched rather than re-collected. This is why opening a second trading account is often quicker than the first.</p>
<p>You will still complete broker-specific steps: segment selection, tariff acceptance, and e-signing the account opening form.</p>

<h2>The one rule that protects you throughout</h2>
<p>Every OTP in this process is entered by you, on the official app or website. No employee, agent or partner of any legitimate broker needs your OTP, password or PIN at any stage of onboarding.</p>
<p>A representative may stay on a call and talk you through the screens. That is normal and helpful. Asking you to read out the code, or to let them fill the form using your credentials, is not &mdash; and it is the most common way trading account fraud begins.</p>

<h2>Why applications get rejected</h2>
<ul>
<li>Name mismatch between PAN and bank records, including initials and expanded surnames</li>
<li>Mobile number not linked to Aadhaar, which blocks the e-sign step</li>
<li>Unclear document images, or photographs of a screen</li>
<li>Signature that does not match bank records</li>
<li>Missing income proof for derivative activation</li>
</ul>

<h2>After activation</h2>
<p>You receive a client code and demat details from official channels. Keep your application reference number until the account is live. If you are contacted about your application from a personal mobile number, treat it as suspicious and verify through published support channels.</p>
<p><a href="/open-account/">See our account opening steps</a></p>`,
  },

  {
    slug: 'how-to-choose-a-stock-broker',
    title: 'How to Choose a Stock Broker in India',
    desc: 'A framework for choosing a broker based on how you actually trade: cost structure, platform reliability, support, and regulatory standing.',
    h1: 'How to choose a stock broker',
    lede: 'There is no best broker. There is a broker that fits how you actually trade, which is a question only you can answer.',
    body: `
<h2>Start with how you trade, not with a comparison table</h2>
<p>The right answer differs completely depending on your pattern:</p>
<ul>
<li><strong>Long-term delivery investor, a few trades a month.</strong> AMC and DP charges matter most. Per-order brokerage is nearly irrelevant.</li>
<li><strong>Active intraday trader.</strong> Per-order brokerage and platform speed dominate. AMC is noise.</li>
<li><strong>Options trader.</strong> Per-order pricing, margin policy, and platform stability at expiry matter more than anything else.</li>
<li><strong>Occasional investor.</strong> Simplicity, support quality and not being charged for dormancy.</li>
</ul>
<p>Work out which of these you are before looking at any pricing page. Otherwise you will optimise for a number that does not affect you.</p>

<h2>Check regulatory standing first, and treat it as a gate</h2>
<p>Before any commercial comparison, confirm SEBI registration, exchange membership and depository participation from the regulators' own databases. This is a pass-or-fail step, not a scoring criterion.</p>
<p><a href="/learn/how-to-verify-a-stock-broker/">How to verify a broker</a></p>

<h2>Compare total cost, not headline brokerage</h2>
<p>Price a trade you actually place, including statutory charges, DP charges and AMC. Statutory charges are identical across brokers, so a headline comparison exaggerates the real difference between them.</p>
<p>Read the conditions on promotional pricing: which segments it covers, how long it lasts, and what the rate becomes afterwards.</p>

<h2>Things that do not appear on a pricing page</h2>
<ul>
<li><strong>Platform stability under load.</strong> The cost of an app that fails on a volatile day exceeds any brokerage saving. Ask existing users, not the broker.</li>
<li><strong>Support responsiveness.</strong> Test it before you need it. Send a question and see how long a real answer takes.</li>
<li><strong>Withdrawal reliability.</strong> Whether payouts actually arrive on the stated timeline, consistently.</li>
<li><strong>Charge transparency.</strong> Whether the published schedule matches the contract notes actually issued.</li>
<li><strong>Grievance handling.</strong> Whether the broker tells you clearly how to escalate past them.</li>
</ul>

<h2>On new platforms specifically</h2>
<p>A new broker has no track record on the items above. That is a genuine, unavoidable disadvantage, and it should be weighed honestly against whatever pricing or product advantage is on offer.</p>
<p>Two things reduce the risk sensibly: verify the regulatory position rigorously, and consider starting small rather than moving an entire portfolio. You are not required to close an existing account to try another platform, and holding accounts with more than one broker is entirely normal.</p>

<h2>Questions worth asking any broker before you sign up</h2>
<ul>
<li>What is your full schedule of charges, including AMC, DP and auto square-off?</li>
<li>Who is your compliance officer, and how do I escalate a grievance past your support team?</li>
<li>What happens to my holdings if you cease operations?</li>
<li>What are your withdrawal timelines, and what causes them to slip?</li>
<li>Will anyone from your organisation ever ask me for an OTP? (The only acceptable answer is no.)</li>
</ul>`,
  },

  {
    slug: 'how-to-compare-brokerage-charges',
    title: 'How to Compare Brokerage Charges Properly',
    desc: 'A method for comparing broker costs that accounts for statutory charges, DP charges, AMC and your actual trading pattern.',
    h1: 'How to compare brokerage charges',
    lede: 'Comparing headline rates tells you almost nothing. Comparing a trade you actually place tells you everything.',
    body: `
<h2>The problem with headline comparisons</h2>
<p>Broker marketing compares one number: brokerage. But a large, often dominant share of what you pay is statutory &mdash; STT, GST, stamp duty, exchange charges, SEBI fees &mdash; and is identical everywhere.</p>
<p>So a table showing one broker at a lower brokerage than another can be entirely accurate and still misrepresent the difference in what you will actually pay.</p>

<h2>A method that works</h2>

<h3>1. Write down your real trading pattern</h3>
<p>Not what you aspire to. What your last three months look like: how many trades, in which segments, at what average value, how many different scrips you sell in a typical month.</p>

<h3>2. Price one representative trade fully at each broker</h3>
<p>Include every line: brokerage, STT, GST, stamp duty, exchange charges, SEBI fees, and DP charges where applicable. Use each broker's own published schedule, on the same day.</p>

<h3>3. Add the annual costs</h3>
<p>AMC, and any account opening charge amortised over the period you expect to hold the account. For a low-frequency investor this can exceed all trading charges combined.</p>

<h3>4. Multiply by your actual volume</h3>
<p>Now you have an annual cost per broker for how you actually trade &mdash; which is the only number that means anything.</p>

<h2>Traps to watch for</h2>
<ul>
<li><strong>Per order versus per executed lot.</strong> A flat fee charged per lot behaves very differently from one charged per order when large orders fill in parts.</li>
<li><strong>Caps and minimums.</strong> A percentage brokerage with a minimum per order can be expensive on small trades.</li>
<li><strong>Promotional windows.</strong> Check what the rate reverts to, and when.</li>
<li><strong>Segment coverage.</strong> A nil-brokerage offer may cover delivery only, while your volume is in options.</li>
<li><strong>DP charges.</strong> Not identical across brokers, and disproportionately important for investors who sell small quantities of several stocks.</li>
<li><strong>Auto square-off charges.</strong> Easy to overlook until you leave an intraday position open.</li>
</ul>

<h2>Verify the sources yourself</h2>
<p>Broker charges change, sometimes with little notice. Any comparison you read &mdash; including ours &mdash; is a snapshot. Before deciding, open each broker's own charges page and confirm the figures on the day you are comparing.</p>
<p><a href="/compare/">See our source-linked comparison</a> &middot; <a href="/pricing/#calculator">Price a specific trade</a></p>`,
  },
];

const shell = (p) =>
  '<!--meta ' +
  JSON.stringify({ title: p.title + ' | Trade Grow', description: p.desc }) +
  '-->\n' +
  `
<section class="section">
  <div class="wrap">
    <div class="section__head">
      <p class="eyebrow"><a href="/learn/">Learn</a></p>
      <h1 class="h1">${p.h1}</h1>
      <p class="lede">${p.lede}</p>
    </div>
    <div class="prose">${p.body}</div>
    <div class="notice" style="margin-top:32px">
      <strong>This is educational content, not advice.</strong>
      Trade Grow does not provide investment, tax or legal advice, and nothing on this page is a
      recommendation to buy or sell any security. Rules and rates change &mdash; confirm anything
      material against the current regulations or a qualified professional.
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    <div class="cta-band">
      <h2 class="h2">Apply this to us</h2>
      <p>Everything above is a test you can run on Trade Grow. We would rather you did.</p>
      <div class="cta-band__actions">
        <a class="btn btn--primary btn--lg" href="/verify/" data-ev="verify_page_view">Verify Our Details</a>
        <a class="btn btn--ghost btn--lg" href="/pricing/" data-ev="pricing_view">View Our Charges</a>
      </div>
    </div>
  </div>
</section>
`;

fs.mkdirSync(dir, { recursive: true });
for (const p of pages) {
  fs.writeFileSync(path.join(dir, p.slug + '.html'), shell(p));
  console.log('  wrote learn/' + p.slug);
}

// Index page for /learn/
const index =
  '<!--meta ' +
  JSON.stringify({
    title: 'Learn — Trading Costs, Demat, KYC and Broker Verification | Trade Grow',
    description: 'Plain-language guides to brokerage charges, STT, DP charges, demat accounts, KYC and how to verify a stock broker in India.',
  }) +
  '-->\n' +
  `
<section class="section">
  <div class="wrap">
    <div class="section__head">
      <p class="eyebrow">Learn</p>
      <h1 class="h1">Understand the system before you pick a broker</h1>
      <p class="lede">
        These guides explain how charges, demat accounts, KYC and broker verification actually work
        in India. None of them are about why you should choose us &mdash; several of them give you
        tools to judge us more harshly.
      </p>
    </div>
    <div class="cards">
      ${pages
        .map(
          (p) => `
      <article class="card">
        <h2 class="card__title">${p.h1}</h2>
        <p class="card__body">${p.lede}</p>
        <a class="card__link" href="/learn/${p.slug}/">Read the guide <span aria-hidden="true">&rarr;</span></a>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>
`;
fs.writeFileSync(path.join(dir, 'index.html'), index);
console.log('  wrote learn/index');
