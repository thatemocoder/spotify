export interface RiaaYear {
  year: number;
  physical: number;
  digitalDownload: number;
  streaming: number;
  total: number;
  pctStreaming: number;
  pctPhysical: number;
  pctDigital: number;
}

const raw = [
  { year: 1973, physical: 2.0, digitalDownload: 0, streaming: 0 },
  { year: 1974, physical: 2.2, digitalDownload: 0, streaming: 0 },
  { year: 1975, physical: 2.4, digitalDownload: 0, streaming: 0 },
  { year: 1976, physical: 2.7, digitalDownload: 0, streaming: 0 },
  { year: 1977, physical: 3.5, digitalDownload: 0, streaming: 0 },
  { year: 1978, physical: 4.1, digitalDownload: 0, streaming: 0 },
  { year: 1979, physical: 4.0, digitalDownload: 0, streaming: 0 },
  { year: 1980, physical: 3.7, digitalDownload: 0, streaming: 0 },
  { year: 1981, physical: 3.6, digitalDownload: 0, streaming: 0 },
  { year: 1982, physical: 3.8, digitalDownload: 0, streaming: 0 },
  { year: 1983, physical: 4.0, digitalDownload: 0, streaming: 0 },
  { year: 1984, physical: 4.4, digitalDownload: 0, streaming: 0 },
  { year: 1985, physical: 4.7, digitalDownload: 0, streaming: 0 },
  { year: 1986, physical: 5.0, digitalDownload: 0, streaming: 0 },
  { year: 1987, physical: 5.6, digitalDownload: 0, streaming: 0 },
  { year: 1988, physical: 5.9, digitalDownload: 0, streaming: 0 },
  { year: 1989, physical: 6.2, digitalDownload: 0, streaming: 0 },
  { year: 1990, physical: 6.8, digitalDownload: 0, streaming: 0 },
  { year: 1991, physical: 7.5, digitalDownload: 0, streaming: 0 },
  { year: 1992, physical: 8.0, digitalDownload: 0, streaming: 0 },
  { year: 1993, physical: 9.1, digitalDownload: 0, streaming: 0 },
  { year: 1994, physical: 9.9, digitalDownload: 0, streaming: 0 },
  { year: 1995, physical: 11.0, digitalDownload: 0, streaming: 0 },
  { year: 1996, physical: 12.0, digitalDownload: 0, streaming: 0 },
  { year: 1997, physical: 12.5, digitalDownload: 0, streaming: 0 },
  { year: 1998, physical: 11.8, digitalDownload: 0, streaming: 0 },
  { year: 1999, physical: 11.0, digitalDownload: 0, streaming: 0 },
  { year: 2000, physical: 10.0, digitalDownload: 0, streaming: 0 },
  { year: 2001, physical: 8.5, digitalDownload: 0.0, streaming: 0 },
  { year: 2002, physical: 7.8, digitalDownload: 0.1, streaming: 0 },
  { year: 2003, physical: 7.0, digitalDownload: 0.5, streaming: 0 },
  { year: 2004, physical: 6.1, digitalDownload: 1.0, streaming: 0 },
  { year: 2005, physical: 5.7, digitalDownload: 1.8, streaming: 0.0 },
  { year: 2006, physical: 5.4, digitalDownload: 2.5, streaming: 0.0 },
  { year: 2007, physical: 5.0, digitalDownload: 3.0, streaming: 0.1 },
  { year: 2008, physical: 4.8, digitalDownload: 3.2, streaming: 0.1 },
  { year: 2009, physical: 4.2, digitalDownload: 3.1, streaming: 0.3 },
  { year: 2010, physical: 3.5, digitalDownload: 2.9, streaming: 0.6 },
  { year: 2011, physical: 2.8, digitalDownload: 2.6, streaming: 1.0 },
  { year: 2012, physical: 2.5, digitalDownload: 2.4, streaming: 1.6 },
  { year: 2013, physical: 2.4, digitalDownload: 2.2, streaming: 2.4 },
  { year: 2014, physical: 2.3, digitalDownload: 1.9, streaming: 3.4 },
  { year: 2015, physical: 2.2, digitalDownload: 1.7, streaming: 4.6 },
  { year: 2016, physical: 2.1, digitalDownload: 1.4, streaming: 5.9 },
  { year: 2017, physical: 2.0, digitalDownload: 1.1, streaming: 7.5 },
  { year: 2018, physical: 1.8, digitalDownload: 0.9, streaming: 8.8 },
  { year: 2019, physical: 1.6, digitalDownload: 0.7, streaming: 10.0 },
  { year: 2020, physical: 1.4, digitalDownload: 0.6, streaming: 11.8 },
  { year: 2021, physical: 1.2, digitalDownload: 0.5, streaming: 13.4 },
  { year: 2022, physical: 1.1, digitalDownload: 0.4, streaming: 15.9 },
  { year: 2023, physical: 1.0, digitalDownload: 0.3, streaming: 17.1 },
  { year: 2024, physical: 0.9, digitalDownload: 0.3, streaming: 19.3 },
];

export const riaaData: RiaaYear[] = raw.map((d) => {
  const total = d.physical + d.digitalDownload + d.streaming;
  return {
    ...d,
    total,
    pctStreaming: total > 0 ? Math.round((d.streaming / total) * 1000) / 10 : 0,
    pctPhysical: total > 0 ? Math.round((d.physical / total) * 1000) / 10 : 0,
    pctDigital: total > 0 ? Math.round((d.digitalDownload / total) * 1000) / 10 : 0,
  };
});

export const riaaFrom1980 = riaaData.filter((d) => d.year >= 1980);
export const riaaFrom2005 = riaaData.filter((d) => d.year >= 2005);
