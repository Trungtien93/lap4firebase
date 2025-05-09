const URL = "https://randomuser.me/api/?seed=fullstackio&results=100";

export const fetchContacts = async () => {
  const res = await fetch(URL);
  const json = await res.json();
  return json.results.map(contact => ({
    name: `${contact.name.first} ${contact.name.last}`,
    avatar: contact.picture.thumbnail,
    phone: contact.phone,
    email: contact.email,
    cell: contact.cell,
    favorite: Math.random() < 0.3,
  }));
};

export const fetchUserContact = async () => {
  const res = await fetch("https://randomuser.me/api/?seed=fullstackio");
  const json = await res.json();
  return json.results[0];
};
