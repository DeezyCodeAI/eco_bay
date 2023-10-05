import styles from "./styles.module.scss";
import Link from "next/link";
import { HiLocationMarker } from "react-icons/hi";


export default function Copyright({country}) {
    const year = new Date().getFullYear();
  return (
    <div className={styles.footer__copyright}>
       <section>
        @{year} ANDROBAY All Rights Reserved
       </section>
       <section>
        <ul>
            {data.map((link)=> (
                    <li>
                        <Link href={link.link}>{link.name}
                        </Link>
                    </li>
            ))}
            <li>
                <a>
                    <HiLocationMarker/> {country.name}
                </a>
            </li>
        </ul>
       </section>
        </div>
  )
}
const data = [
    {
      name: "Privacy Center",
      link: "",
    },
    {
      name: "Privacy & Cookie Policy",
      link: "",
    },
    {
      name: "Manage Cookies",
      link: "",
    },
    {
      name: "Terms & Conditions",
      link: "",
    },
    {
      name: "Copyright Notice",
      link: "",
    },
  ];
