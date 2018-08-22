jQuery(document).ready(function() {
  var update_texts = function() {
    $('body').i18n();
  };

  $('.lang-switch').click(function(e) {
    e.preventDefault();
    $.i18n().locale = $(this).data('locale');
    update_texts();
  });

  $.i18n().load({
    'en': {
      'lang-select': 'Language',
      'nav-about': 'About',
      'nav-participate': 'Participate',
      'nav-partners': 'Partners',
      'nav-contact': 'Contact',
      'nav-donate': 'Donate',
      'intro-subheading': 'A Basic Income on the Blockchain',
      'whitepaper-link': 'Read the Whitepaper',
      'overview-heading': 'What is',
      'donate-overview-heading': 'How do I donate to',
      'overview-subheading': 'Circles is an electronic cryptocurrency with the aim to create and distribute a globally accessible Universal Basic Income.',
      'donate-overview-subheading': 'Listed below are the available donation methods. Please <a href="mailto:donate@joincircles.net?"></a> if you have one you would like to suggest.',
      'credit-heading': 'Credit-Based',      
      'credit-subheading': 'In traditional debt-based currencies one sells goods, borrows money, or invests working power to receive money. With Circles, one receives money unconditionally to engage with their community, creating value through offering goods or services.',
      'decentral-heading': 'Decentralized',
      'decentral-subheading': 'A worldwide basic income is something so powerful that no single entity should have control over the money or its recipients. Using blockchain technology, Circles will be independent of any central issuing authority or institution.',
      'resilient-heading': 'Resilient',
      'resilient-subheading': 'Circles will run on the blockchain, a secure, decentralised, and autonomously managed database. Since the system\'s money emerges from a network of peer-to-peer relationships, it is possible to maintain stability on a local level, regardless of how things go at the national or global scale.',
      'cooperation-heading': 'Fostering Cooperation',
      'cooperation-subheading': 'Circles promotes cooperation and economic interaction by creating local trade networks. The more connected community members are to each other, the more valuable their network becomes.',
      'hoarding-heading': 'Hoarding Resistant',
      'hoarding-subheading': 'Circles has an inbuilt inflation target of 5% per annum to discourage hoarding. This also increases the velocity of money in circulation, creating more opportunities for exchange and economic activity.',
      'seigniorage-heading': 'Seigniorage',
      'seigniorage-subheading': 'Seigniorage refers to the profit made from the difference between the production costs and the value of money. As Circles is a credit-based currency that costs almost nothing to create, you will retain almost all of this value as first spender.',
      'participate-heading': 'How can I participate?',
      'chat-heading': 'Chat with Us',
      'chat-subheading': 'Circles is an open source community, and we are always looking for passionate contributors. If you are interested in participating or want to follow our progress, please join our chat room.',
      'chat-link': 'Join our Chat',
      'support-heading': 'Support',
      'support-subheading': 'We are always seeking sponsors to offer a city, space, or resources for testing an implmentation of our basic income prototype. Interested in supporting the project?',
      'support-link': 'Contact Us',
      'partner-heading': 'Partners',
      'partner-subheading': 'Organizations participating in the development and implementation of Circles.',
      'partner-participate': 'Want to participate?',
      'contact': 'Contact us.',
      'contact-text': 'For any inquiries, e-mail',
      'contact-chat': 'or come join our',
      'donate-ether-heading': 'Ether',
      'donate-ether-subheading': 'Send to this address: *************',
      'donate-bank-heading': 'Bank Transfer',
      'donate-bank-subheading': 'You can send your donation to IBAN *************',
      'donate-bitcoin-heading': 'Bitcoin',
      'donate-bitcoin-subheading': 'Send to this address: *************'
    },
    'de': {
      'lang-select': 'Sprache',
      'nav-about': 'Über',
      'nav-participate': 'Mitmachen',
      'nav-partners': 'Partner',
      'nav-contact': 'Kontaktiere',
      'intro-subheading': 'Ein Grundeinkommen auf der Blockchain',
      'whitepaper-link': 'Zum White Paper',
      'overview-heading': 'Was ist',
      'overview-subheading': 'Circles ist eine Kryptowährung mit dem Ziel, ein alternatives Geldsystem auf der Basis eines regelmäßigen Einkommens zu schaffen.',
      'credit-heading': 'Grundlage: Vertrauen',
      'credit-subheading': 'In traditionellen, auf Schulden basierenden Geldsystemen erhält man nur dann Geld, wenn man Geld leiht, verkauft oder Arbeitskraft investiert. Mit Circles erhält jede*r ohne Gegenleistung ein personalisiertes Grundeinkommen. Der Wert von Circles entsteht wie bei gewöhnlichem Geld durch Akzeptanz, und ein Vertrauensnetzwerk innerhalb einer Gemeinschaft.',
      'decentral-heading': 'Dezentralisierung',
      'decentral-subheading': 'Ein Grundeinkommen ist eine so große Idee, dass nichts und niemand dieses zentral kontrollieren sollte. Weil Circles unabhängig von einer zentralen geldgebenden Institution oder Autorität sein soll, arbeiten wir mit Blockchain-Technologie. Die Regeln, auf denen Circles basiert, sind transparent und offen zugänglich.',
      'resilient-heading': 'Sicherheit',
      'resilient-subheading': 'Circles wird auf der Blockchain laufen, einer sicheren, dezentralen und autonom verwalteten Datenbank, die nicht manipuliert werden kann. Wir nutzen außerdem eine Kombination verschiedener Techniken zur Verifizierung der Mitglieder.',
      'cooperation-heading': 'Kooperation',
      'cooperation-subheading': 'Circles als alternatives Geldsystem fördert das Miteinander einer Gemeinschaft durch lokale Netzwerke. Je dichter die Verbindungen und je aktiver die Gemeinschaft, desto mehr Lebendigkeit und damit Wert hat ein Circles-Netzwerk.',
      'hoarding-heading': 'Aktivität',
      'hoarding-subheading': 'Im System von Circles ist eine Wachstumsrate von 5% pro Jahr integriert, um das Verhältnis von “neu” geschöpftem Geld und der Gesamtmenge von Circles im Umlauf zu stabilisieren. Als “Nebeneffekt” wird Handel und Tausch angeregt.',
      'seigniorage-heading': 'Seigniorage',
      'seigniorage-subheading': 'Mit Seigniorage bezeichnet man den Gewinn, der nach Abzug der Produktionskosten vom Geldwert übrig bleibt. Da es fast nichts kostet, das System von Circles zu betreiben, geht kaum Wert verloren.',
      'participate-heading': 'Wie kann ich mitmachen?',
      'chat-heading': 'Sprich mit uns!',
      'chat-subheading': 'Circles ist ein Open Source Projekt und wir freuen uns sehr über engagierte Mitstreiter*innen. Im Moment suchen wir besonders Verstärkung in den Bereichen Rechtsberatung, Design, Illustration, Mobile Development, Wirtschaftstheorie und Forschungsdesign.',
      'chat-link': 'Zum Chat',
      'support-heading': 'Unterstütze',
      'support-subheading': 'Wir suchen immer Sponsor*innen und Förderer*innen, die uns ermöglichen, einen Prototypen unseres Projekts in verschiedenen Kontexten und Communities umzusetzen. Interessiert, uns zu unterstützen?',
      'support-link': 'Kontakt aufnehmen',
      'partner-heading': 'Partner',
      'partner-subheading': 'Diese Organisationen sind an der Entwicklung und Implementierung von Circles beteiligt:',
      'partner-participate': 'Mitmachen? Nimm Kontakt mit uns auf!',
      'contact': 'Kontaktiere uns',
      'contact-text': 'Nachricht an uns',
      'contact-chat': 'oder zum'
    }
  });

  update_texts();
});