import { WEDDINGS_ENABLED } from './focus'

const weddingServices = [
  { id: 'weddings', title: 'Weddings & engagements', text: 'The rituals, the reunions and the moments between. Photography that keeps the feeling of your celebration.', details: 'Tell us which ceremonies you want covered, your venues and the hours you need. Mention family portraits, important rituals and any moments you do not want missed.' },
  { id: 'couples', title: 'Pre-wedding & couple shoots', text: 'A little time together. A place you love. Photographs that feel like the two of you.', details: 'Share your preferred setting, outfit ideas and date. We can discuss the light, location access and a comfortable pace before the shoot.' },
  { id: 'portraits', title: 'Portraits & maternity', text: 'Come as you are. Personal portraits, family photographs and milestones worth keeping.', details: 'Whether you are planning a personal portrait or a family session, tell us who will be there and where you feel comfortable. Share any reference images and accessibility needs.' },
  { id: 'events', title: 'Events & celebrations', text: 'The people who showed up. The energy in the room. The details you worked so hard on.', details: 'Send the event schedule, venue, guest count and intended use of the photographs. Include key speakers, group photographs and any time-sensitive moments.' },
  { id: 'brands', title: 'Brands, products & fashion', text: 'Show what makes your work yours. Thoughtful images for products, people and the brands behind them.', details: 'Tell us what you are promoting and where the images will appear. Product count, styling, backgrounds and usage needs help us scope the shoot clearly.' },
  { id: 'films', title: 'Films & reels', text: 'Movement, atmosphere and a story worth watching. Video shaped around your occasion or brand.', details: 'Share the platform, preferred duration and the story you want to tell. Ask about photography and video coverage together, and agree on formats and deliverables before booking.' }
]

const weddingFaqs = [
  { q: 'Where is MAVX Frames based?', a: 'MAVX Frames is based in Chennai and Coimbatore. We take photography and videography enquiries across Tamil Nadu. Share your venue and date so we can confirm availability and travel.' },
  { q: 'What kinds of shoots can I book?', a: 'You can enquire about weddings, engagements, pre-wedding shoots, portraits, maternity sessions, events, commercial photography, fashion, films and reels.' },
  { q: 'How much does a shoot cost?', a: 'The quote depends on the shoot type, coverage hours, location and final deliverables. Send your date, venue and requirements for a quote that matches your plans.' },
  { q: 'How do I check availability?', a: 'Use the enquiry form to share your name, phone or email, shoot type, date and venue. We will review your plans and contact you. An enquiry alone does not confirm a booking.' },
  { q: 'Do you travel outside Chennai and Coimbatore?', a: 'Yes. We cover shoots across Tamil Nadu. Tell us the exact location so travel, accommodation where needed and any venue requirements can be discussed before booking.' },
  { q: 'Can you help me plan a pre-wedding location?', a: 'Share the look you like: a beach, greenery, city streets or a private venue. We can discuss suitable options. Access, photography permissions and any venue fees must be checked before the shoot.' },
  { q: 'When will I receive the photographs or films?', a: 'Delivery depends on the coverage and editing agreed for your shoot. Ask for the delivery schedule, image selection process, file formats and any album or video inclusions in your written quote.' },
  { q: 'What should I send with my enquiry?', a: 'Send your preferred date, city, venue, shoot type, approximate coverage hours and any reference images. If you have a budget or a delivery deadline, include that too.' }
]

const soloServices = [
  { id: 'portraits', title: 'Portraits', text: 'Come as you are. Personal portraits, profile photos and family photographs, shot with care.', details: 'Tell us the look you want, where you would like to shoot and how you plan to use the photographs. Share reference images and any outfit ideas.' },
  { id: 'fashion', title: 'Fashion shoots', text: 'Editorial and portfolio shoots for models, designers and boutiques, in a studio or on location.', details: 'Share your concept, outfits, mood references and where the images will appear. We plan the lighting, location and pace together before the shoot.' },
  { id: 'films', title: 'Reels', text: 'Short, scroll-stopping reels for people and brands. Planned, shot and edited for Instagram.', details: 'Share the platform, the story you want to tell and how many reels you need. Ask about monthly reel packages for regular content.' },
  { id: 'brands', title: 'Products & brands', text: 'Clean, well-lit images for small brands, boutiques, jewellery and food. Made to help you sell.', details: 'Tell us what you are promoting, how many products there are and where the images will be used. Styling, backgrounds and usage needs help us scope the shoot.' },
  { id: 'birthdays', title: 'Birthday shoots', text: 'Kids birthday sessions, milestone birthday portraits and small parties. Candid photos and a short reel.', details: 'Share the date, venue, number of guests and the time you need. Smaller gatherings work best for a solo photographer; ask about add-on reels.' }
]

const soloFaqs = [
  { q: 'Where is MAVX Frames based?', a: 'MAVX Frames is based in Chennai and Coimbatore. We take photography and reel enquiries across Tamil Nadu. Share your location and date so we can confirm availability and travel.' },
  { q: 'What kinds of shoots can I book?', a: 'You can enquire about portraits, fashion shoots, reels, product and brand photography, and small birthday shoots.' },
  { q: 'How much does a shoot cost?', a: 'The quote depends on the shoot type, time needed, location and final deliverables. Send your date, location and requirements for a quote that matches your plans.' },
  { q: 'How do I check availability?', a: 'Use the enquiry form to share your name, phone or email, shoot type, date and location. We will review your plans and contact you. An enquiry alone does not confirm a booking.' },
  { q: 'Do you travel outside Chennai and Coimbatore?', a: 'Yes. We cover shoots across Tamil Nadu. Tell us the exact location so travel and any venue requirements can be discussed before booking.' },
  { q: 'Do you shoot indoors?', a: 'Yes. We shoot indoors with our own lighting for portraits, fashion and product work. Tell us the space you have in mind and we will plan around it.' },
  { q: 'When will I receive the photographs or reels?', a: 'Delivery depends on the shoot and editing agreed. Ask for the delivery schedule, number of edited images or reels, and file formats in your written quote.' },
  { q: 'What should I send with my enquiry?', a: 'Send your preferred date, city, shoot type, approximate time needed and any reference images. If you have a budget or a deadline, include that too.' }
]

export const services = WEDDINGS_ENABLED ? weddingServices : soloServices
export const faqs = WEDDINGS_ENABLED ? weddingFaqs : soloFaqs
